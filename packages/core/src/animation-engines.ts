import { animate, mix } from 'popmotion';

import {
  AggregationAnimationRef,
  AnimationConfig,
  AnimationPlan,
  AnimationRef,
  AnimationResult,
  AnimationRoute,
} from './animation-core.js';
import { ProjectionNode } from './projection.js';
import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './shared.js';

export class ProjectionNodeAnimationEngine {
  protected records = new WeakMap<ProjectionNode, ProjectionNodeAnimationRef>();

  animate(
    node: ProjectionNode,
    config: ProjectionNodeAnimationConfig,
  ): ProjectionNodeAnimationRef {
    this.records.get(node)?.stop();

    let stopper: () => void;

    const promise = new Promise<AnimationResult>((resolve) => {
      const { duration, easing, plan } = config;

      const animateFrame = (progress: number) =>
        this.animateFrame(node, plan, progress);

      animateFrame(0);

      stopper = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: animateFrame,
        onComplete: () => resolve(AnimationResult.Completed),
        onStop: () => resolve(AnimationResult.Stopped),
      }).stop;
    });

    const ref = new ProjectionNodeAnimationRef(node, promise, () => stopper());
    this.records.set(node, ref);
    return ref;
  }

  protected animateFrame(
    node: ProjectionNode,
    plan: AnimationPlan,
    progress: number,
  ): void {
    const boundingBox = this.calculateBoundingBox(plan, progress);
    const borderRadiuses = this.calculateBorderRadiuses(plan, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected calculateBoundingBox(
    plan: AnimationPlan,
    progress: number,
  ): BoundingBox {
    const route = plan['boundingBox'] as AnimationRoute<BoundingBox>;
    const { from, to } = route;
    return new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected calculateBorderRadiuses(
    plan: AnimationPlan,
    progress: number,
  ): BorderRadiusConfig {
    const route = plan['borderRadiuses'] as AnimationRoute<BorderRadiusConfig>;
    const { from, to } = route;

    const mixRadius = (
      from: BorderRadiusCornerConfig,
      to: BorderRadiusCornerConfig,
      progress: number,
    ): BorderRadiusCornerConfig => ({
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    });

    return {
      topLeft: mixRadius(from.topLeft, to.topLeft, progress),
      topRight: mixRadius(from.topRight, to.topRight, progress),
      bottomLeft: mixRadius(from.bottomLeft, to.bottomLeft, progress),
      bottomRight: mixRadius(from.bottomRight, to.bottomRight, progress),
    };
  }
}

export class ProjectionNodeAnimationRef extends AnimationRef {
  constructor(
    public node: ProjectionNode,
    promise: Promise<AnimationResult>,
    stopper: () => void,
  ) {
    super(promise, stopper);
  }
}

export interface ProjectionNodeAnimationConfig extends AnimationConfig {
  plan: AnimationPlan;
}

export class ProjectionTreeAnimationEngine {
  protected records = new WeakMap<ProjectionNode, ProjectionTreeAnimationRef>();

  constructor(protected engine: ProjectionNodeAnimationEngine) {}

  animate(
    root: ProjectionNode,
    config: ProjectionTreeAnimationConfig,
  ): ProjectionTreeAnimationRef {
    this.records.get(root)?.stop();
    const { duration, easing, plans } = config;

    const animations: ProjectionNodeAnimationRef[] = [];
    root.traverse(
      (node) => {
        const plan = plans.get(node.id);
        if (!plan) throw new Error('Unknown node');
        const config: ProjectionNodeAnimationConfig = {
          duration,
          easing,
          plan,
        };
        const animation = this.engine.animate(node, config);
        animations.push(animation);
      },
      { includeSelf: true },
    );

    const ref = new ProjectionTreeAnimationRef(root, animations);
    this.records.set(root, ref);
    return ref;
  }
}

export class ProjectionTreeAnimationRef extends AggregationAnimationRef {
  constructor(public root: ProjectionNode, refs: ProjectionNodeAnimationRef[]) {
    super(refs);
  }
}

export interface ProjectionTreeAnimationConfig extends AnimationConfig {
  plans: Map<ProjectionNode['id'], AnimationPlan>;
}
