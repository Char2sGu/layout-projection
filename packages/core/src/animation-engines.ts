import { animate, Easing, mix } from 'popmotion';

import { ProjectionNode } from './projection.js';
import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './shared.js';

export class ProjectionNodeAnimationEngine {
  protected records = new WeakMap<ProjectionNode, AnimationRef>();

  animate(
    node: ProjectionNode,
    config: ProjectionNodeAnimationConfig,
  ): ProjectionNodeAnimationRef {
    this.records.get(node)?.stop();

    let stopper: () => void;

    const promise = new Promise<void>((resolve) => {
      const { duration, easing, route } = config;

      const animateFrame = (progress: number) =>
        this.animateFrame(node, route, progress);

      animateFrame(0);

      stopper = animate({
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
      }).stop;
    });

    const ref = new ProjectionNodeAnimationRef(node, promise, () => stopper());
    this.records.set(node, ref);
    return ref;
  }

  protected animateFrame(
    node: ProjectionNode,
    route: ProjectionNodeAnimationRoute,
    progress: number,
  ): void {
    const boundingBox = this.calculateBoundingBox(route, progress);
    const borderRadiuses = this.calculateBorderRadiuses(route, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected calculateBoundingBox(
    route: ProjectionNodeAnimationRoute,
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
    route: ProjectionNodeAnimationRoute,
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

export class ProjectionTreeAnimationEngine {
  protected records = new WeakMap<ProjectionNode, AnimationRef>();

  constructor(protected engine: ProjectionNodeAnimationEngine) {}

  animate(
    root: ProjectionNode,
    config: ProjectionTreeAnimationConfig,
  ): ProjectionTreeAnimationRef {
    this.records.get(root)?.stop();
    const { duration, easing, routes } = config;

    const animations: ProjectionNodeAnimationRef[] = [];
    root.traverse(
      (node) => {
        const route = routes.get(node.id);
        if (!route) throw new Error('Unknown node');
        const config: ProjectionNodeAnimationConfig = {
          duration,
          easing,
          route,
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

export interface AnimationConfig {
  duration: number;
  easing: Easing;
}

export interface ProjectionNodeAnimationConfig extends AnimationConfig {
  route: ProjectionNodeAnimationRoute;
}

export interface ProjectionTreeAnimationConfig extends AnimationConfig {
  routes: ProjectionNodeAnimationRouteMap;
}

export interface ProjectionNodeAnimationRoute {
  boundingBoxFrom: BoundingBox;
  boundingBoxTo: BoundingBox;
  borderRadiusesFrom: BorderRadiusConfig;
  borderRadiusesTo: BorderRadiusConfig;
}

export class ProjectionNodeAnimationRouteMap extends Map<
  ProjectionNode['id'],
  ProjectionNodeAnimationRoute
> {}

export class AnimationRef implements PromiseLike<void> {
  constructor(private promise: Promise<any>, private stopper: () => void) {}

  then<TResult1 = void, TResult2 = never>(
    onfulfilled?:
      | ((value: void) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  stop(): void {
    this.stopper();
  }
}

export class ProjectionNodeAnimationRef extends AnimationRef {
  constructor(
    public node: ProjectionNode,
    promise: Promise<any>,
    stopper: () => void,
  ) {
    super(promise, stopper);
  }
}

export class ProjectionTreeAnimationRef extends AnimationRef {
  constructor(
    public root: ProjectionNode,
    animations: ProjectionNodeAnimationRef[],
  ) {
    super(
      Promise.all(animations), //
      () => animations.forEach((ref) => ref.stop()),
    );
  }
}
