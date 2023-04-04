import { animate, Easing, mix } from 'popmotion';

import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './core.js';
import { Node } from './node.js';

export class NodeAnimationEngine {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  animate(node: Node, config: NodeAnimationConfig): AnimationRef {
    this.pendingAnimations.get(node)?.stop();

    const ref = new AnimationRef((resolve) => {
      const { duration, easing, route } = config;

      const animateFrame = (progress: number) =>
        this.animateFrame(node, route, progress);

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
    route: NodeAnimationRoute,
    progress: number,
  ): void {
    const boundingBox = this.calculateBoundingBox(route, progress);
    const borderRadiuses = this.calculateBorderRadiuses(route, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected calculateBoundingBox(
    route: NodeAnimationRoute,
    progress: number,
  ): BoundingBox {
    const from = route.boundingBoxFrom;
    const to = route.boundingBoxTo;
    return new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected calculateBorderRadiuses(
    route: NodeAnimationRoute,
    progress: number,
  ): BorderRadiusConfig {
    const from = route.borderRadiusesFrom;
    const to = route.borderRadiusesTo;

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

  animate(root: Node, config: TreeAnimationConfig): AnimationRef {
    this.pendingAnimations.get(root)?.stop();
    const { duration, easing, routes } = config;

    const animations: AnimationRef[] = [];
    root.traverse(
      (node) => {
        const route = routes.get(node.id);
        if (!route) throw new Error('Unknown node');
        const config: NodeAnimationConfig = { duration, easing, route };
        const animation = this.engine.animate(node, config);
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

export interface AnimationConfig {
  duration: number;
  easing: Easing;
}

export interface NodeAnimationConfig extends AnimationConfig {
  route: NodeAnimationRoute;
}

export interface TreeAnimationConfig extends AnimationConfig {
  routes: NodeAnimationRouteMap;
}

export interface NodeAnimationRoute {
  boundingBoxFrom: BoundingBox;
  boundingBoxTo: BoundingBox;
  borderRadiusesFrom: BorderRadiusConfig;
  borderRadiusesTo: BorderRadiusConfig;
}

export class NodeAnimationRouteMap extends Map<
  Node['id'],
  NodeAnimationRoute
> {}

// TODO: save more context info
export class AnimationRef extends Promise<void> {
  stopFn?: () => void;
  stop(): void {
    this.stopFn?.();
  }
}
