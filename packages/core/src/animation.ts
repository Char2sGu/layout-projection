import { easeInOut, Easing } from 'popmotion';

import {
  AnimationPlan,
  AnimationRef,
  AnimationResult,
  AnimationRoute,
} from './animation-core.js';
import { ProjectionTreeAnimationEngine } from './animation-engines.js';
import { CssEasingParser } from './css.js';
import { MeasuredProjectionNode, ProjectionNode } from './projection.js';
import { BoundingBox } from './shared.js';
import {
  ProjectionNodeSnapper,
  ProjectionNodeSnapshot,
  ProjectionNodeSnapshotMap,
} from './snapshot.js';

export interface AnimationPlanner {
  plan(context: AnimationPlanningContext): AnimationPlan;
}
export interface AnimationPlanningContext {
  root: MeasuredProjectionNode;
  node: MeasuredProjectionNode;
  snapshot?: ProjectionNodeSnapshot;
  snapshots: ProjectionNodeSnapshotMap;
}

export class LayoutAnimator {
  constructor(
    protected engine: ProjectionTreeAnimationEngine,
    protected easingParser: CssEasingParser,
    protected planners: AnimationPlanner[],
  ) {}

  animate(config: LayoutAnimationConfig): AnimationRef {
    const { root, from: snapshots, estimation = false } = config;
    if (typeof config.easing === 'string')
      config.easing = this.easingParser.parse(config.easing);
    const { duration = 225, easing = easeInOut } = config;

    this.initialize(root);
    const plans = this.getAnimationPlans(root, snapshots, estimation);
    const ref = this.engine.animate(root, { duration, easing, plans });

    ref.then((result) => {
      if (result === AnimationResult.Completed)
        root.traverse((node) => node.reset(), { includeSelf: true });
    });

    return ref;
  }

  protected initialize(root: ProjectionNode): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    root.traverse((node) => node.reset(), { includeSelf: true });
    root.traverse((node) => node.measure(), { includeSelf: true });
  }

  protected getAnimationPlans(
    root: ProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
    estimation: boolean,
  ): Map<ProjectionNode['id'], AnimationPlan> {
    const map = new Map<ProjectionNode['id'], AnimationPlan>();

    root.traverse(
      (node) => {
        if (!node.measured()) throw new Error('Unknown node');

        const snapshot = snapshots.get(node.id);
        // This is the old node instance in a shared-element layout animation,
        // it should share the same animation config with the new instance.
        if (map.has(node.id) && node.element === snapshot?.element) return;

        const context: AnimationPlanningContext = {
          root: root as MeasuredProjectionNode, // root is the first node traversed
          ...{ node, snapshots, snapshot, estimation },
        };

        const plan: AnimationPlan = this.planners.reduce(
          (plan, planner) => ({ plan, ...planner.plan(context) }),
          { boundingBox: this.getBoundingBoxRoute(context, estimation) },
        );

        map.set(node.id, plan);
      },
      { includeSelf: true },
    );

    return map;
  }

  protected getBoundingBoxRoute(
    context: AnimationPlanningContext,
    estimation: boolean,
  ): AnimationRoute<BoundingBox> {
    const { root, node, snapshot, snapshots } = context;
    const from =
      snapshot?.boundingBox ||
      (estimation &&
        this.estimateBoundingBoxRouteStart(root, node, snapshots)) ||
      node.boundingBox;
    const to = node.boundingBox;
    return { from, to };
  }

  protected estimateBoundingBoxRouteStart(
    root: MeasuredProjectionNode,
    node: MeasuredProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
  ): BoundingBox | undefined {
    if (!node.measured()) throw new Error('Unknown node');

    let ancestor: ProjectionNode = node;
    let ancestorSnapshot: ProjectionNodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = snapshots.get(ancestor.id)) === undefined) {
      if (ancestor === root || !ancestor.parent) return;
      ancestor = ancestor.parent;
    }
    if (!ancestor.measured()) throw new Error('Unknown ancestor');

    const transform = ancestor.calculateTransform(ancestorSnapshot.boundingBox);
    const scale = transform.x.scale;

    return new BoundingBox({
      top:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.top) * scale,
      left:
        ancestorSnapshot.boundingBox.left -
        (ancestor.boundingBox.left - node.boundingBox.left) * scale,
      right:
        ancestorSnapshot.boundingBox.right -
        (ancestor.boundingBox.right - node.boundingBox.right) * scale,
      bottom:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.bottom) * scale,
    });
  }
}

export interface LayoutAnimationConfig {
  root: ProjectionNode;
  from: ProjectionNodeSnapshotMap;
  duration?: number;
  easing?: string | Easing;
  estimation?: boolean;
}

export class LayoutAnimationEntry {
  readonly node: ProjectionNode;
  readonly snapshots: ProjectionNodeSnapshotMap;
  protected animator: LayoutAnimator;
  protected snapper: ProjectionNodeSnapper;
  protected animationConfig: LayoutAnimationEntryAnimationConfig;

  constructor(config: LayoutAnimationEntryConfig) {
    this.node = config.node;
    this.snapshots = config.storage ?? new ProjectionNodeSnapshotMap();
    [this.animator, this.snapper] = config.deps;
    this.animationConfig = config.animation ?? {};
  }

  snapshot(): void {
    const snapshots = this.snapper.snapshotTree(this.node);
    this.snapshots.merge(snapshots);
  }

  animate(config?: LayoutAnimationEntryAnimationConfig): AnimationRef {
    return this.animator.animate({
      ...this.animationConfig,
      ...config,
      root: this.node,
      from: this.snapshots,
    });
  }
}

export interface LayoutAnimationEntryConfig {
  node: ProjectionNode;
  deps: [LayoutAnimator, ProjectionNodeSnapper];
  storage?: ProjectionNodeSnapshotMap;
  animation?: LayoutAnimationEntryAnimationConfig;
}

export interface LayoutAnimationEntryAnimationConfig
  extends Omit<LayoutAnimationConfig, 'root' | 'from'> {}
