import { animate, mix } from 'popmotion';

import {
  AggregationAnimationRef,
  AnimationConfig,
  AnimationRef,
  AnimationResult,
  AnimationTag,
} from './animation-core.js';
import { ProjectionNode } from './projection.js';
import { BoundingBox } from './projection-core.js';

export interface AnimationHandler {
  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void;
}

export class ProjectionNodeAnimationEngine {
  protected records = new WeakMap<ProjectionNode, ProjectionNodeAnimationRef>();

  constructor(protected handlers: AnimationHandler[]) {}

  animate(
    node: ProjectionNode,
    config: ProjectionNodeAnimationConfig,
  ): ProjectionNodeAnimationRef {
    this.records.get(node)?.stop();

    let stopper: () => void;

    const promise = new Promise<AnimationResult>((resolve) => {
      const { duration, easing, plan } = config;

      const handleFrame = (progress: number) =>
        this.handleFrame(node, plan, progress);

      handleFrame(0);

      stopper = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: handleFrame,
        onComplete: () => resolve(AnimationResult.Completed),
        onStop: () => resolve(AnimationResult.Stopped),
      }).stop;
    });

    const ref = new ProjectionNodeAnimationRef(node, promise, () => stopper());
    this.records.set(node, ref);
    return ref;
  }

  protected handleFrame(
    node: ProjectionNode,
    plan: AnimationPlan,
    progress: number,
  ): void {
    const boundingBox = this.calcFrameBoundingBox(plan.boundingBox, progress, {
      position: node.hasTag(AnimationTag.AnimatePosition),
      size: node.hasTag(AnimationTag.AnimateSize),
    });
    this.handlers.forEach((h) => h.handleFrame(node, progress, plan));
    node.project(boundingBox);
  }

  protected calcFrameBoundingBox(
    route: AnimationRoute<BoundingBox>,
    progress: number,
    config: { position: boolean; size: boolean },
  ): BoundingBox {
    const { from, to } = route;
    if (config.position && config.size) {
      return new BoundingBox({
        top: mix(from.top, to.top, progress),
        left: mix(from.left, to.left, progress),
        right: mix(from.right, to.right, progress),
        bottom: mix(from.bottom, to.bottom, progress),
      });
    } else if (config.position) {
      const top = mix(from.top, to.top, progress);
      const left = mix(from.left, to.left, progress);
      return new BoundingBox({
        top,
        left,
        right: left + to.width(),
        bottom: top + to.height(),
      });
    } else if (config.size) {
      return new BoundingBox({
        top: to.top,
        left: to.left,
        right: to.left + mix(from.width(), to.width(), progress),
        bottom: to.top + mix(from.height(), to.height(), progress),
      });
    }
    return to;
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

export interface AnimationPlan {
  boundingBox: AnimationRoute<BoundingBox>;
  [name: string]: AnimationRoute<unknown>;
}
export interface AnimationRoute<Value> {
  from: Value;
  to: Value;
}
