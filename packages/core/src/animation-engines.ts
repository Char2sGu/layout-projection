import { animate, Easing, mix } from 'popmotion';

import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './core.js';
import { Node } from './node.js';

export class NodeAnimationEngine {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  animate(node: Node, plan: NodeAnimationPlan): AnimationRef {
    this.pendingAnimations.get(node)?.stop();

    const ref = new AnimationRef((resolve) => {
      const { duration, easing } = plan;

      const animateFrame = (progress: number) =>
        this.animateFrame(node, plan, progress);

      animateFrame(0);
      const { stop } = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: animateFrame,
        onComplete: () => {
          node.reset();
          resolve();
        },
        onStop: resolve,
      });
      ref.stopFn = stop;
    });

    this.pendingAnimations.set(node, ref);
    return ref;
  }

  protected animateFrame(
    node: Node,
    plan: NodeAnimationPlan,
    progress: number,
  ): void {
    const boundingBox = this.calculateBoundingBox(plan, progress);
    const borderRadiuses = this.calculateBorderRadiuses(plan, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected calculateBoundingBox(
    plan: NodeAnimationPlan,
    progress: number,
  ): BoundingBox {
    const from = plan.boundingBoxFrom;
    const to = plan.boundingBoxTo;
    return new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected calculateBorderRadiuses(
    plan: NodeAnimationPlan,
    progress: number,
  ): BorderRadiusConfig {
    const from = plan.borderRadiusesFrom;
    const to = plan.borderRadiusesTo;

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

export class TreeAnimationEngine {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  constructor(protected engine: NodeAnimationEngine) {}

  animate(root: Node, plans: NodeAnimationPlanMap): AnimationRef {
    this.pendingAnimations.get(root)?.stop();

    const animations: AnimationRef[] = [];
    root.traverse(
      (node) => {
        const plan = plans.get(node.id);
        if (!plan) throw new Error('Unknown node');
        const animation = this.engine.animate(node, plan);
        animations.push(animation);
      },
      { includeSelf: true },
    );

    const ref = new AnimationRef((resolve) => {
      Promise.allSettled(animations).then(() => resolve);
    });
    ref.stopFn = () => animations.forEach((ref) => ref.stop());

    this.pendingAnimations.set(root, ref);
    return ref;
  }
}

export interface NodeAnimationPlan {
  duration: number;
  easing: Easing;
  boundingBoxFrom: BoundingBox;
  boundingBoxTo: BoundingBox;
  borderRadiusesFrom: BorderRadiusConfig;
  borderRadiusesTo: BorderRadiusConfig;
}

export class NodeAnimationPlanMap extends Map<Node['id'], NodeAnimationPlan> {}

export class AnimationRef extends Promise<void> {
  stopFn?: () => void;
  stop(): void {
    this.stopFn?.();
  }
}
