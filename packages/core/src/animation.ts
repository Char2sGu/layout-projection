import {
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  Easing,
  linear,
} from 'popmotion';

import { AnimationRef, AnimationResult } from './animation-core.js';
import {
  AnimationPlan,
  AnimationRoute,
  ProjectionTreeAnimationEngine,
} from './animation-engines.js';
import { Layout } from './layout.js';
import { MeasuredProjectionNode, ProjectionNode } from './projection-node.js';
import {
  ProjectionNodeSnapper,
  ProjectionNodeSnapshot,
  ProjectionNodeSnapshotMap,
  ProjectionTreeSnapshotOptions,
} from './snapshot.js';

export interface AnimationPlanner {
  buildPlan(context: AnimationPlanningContext<object>): Partial<AnimationPlan>;
}

export interface AnimationPlanningContext<NodeProperties extends object> {
  root: MeasuredProjectionNode & NodeProperties;
  node: MeasuredProjectionNode & NodeProperties;
  snapshot?: ProjectionNodeSnapshot & NodeProperties;
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

        const context: AnimationPlanningContext<object> = {
          root: root as MeasuredProjectionNode, // root is the first node traversed
          ...{ node, snapshots, snapshot },
        };

        const plan: AnimationPlan = {
          ...this.planners.reduce(
            (plan, planner) => ({
              ...plan,
              ...planner.buildPlan(context),
            }),
            {},
          ),
          layout: this.getLayoutRoute(context, estimation),
        };

        map.set(node.id, plan);
      },
      { includeSelf: true },
    );

    return map;
  }

  protected getLayoutRoute(
    context: AnimationPlanningContext<object>,
    estimation: boolean,
  ): AnimationRoute<Layout> {
    const { root, node, snapshot, snapshots } = context;
    const from =
      snapshot?.layout ||
      (estimation && this.estimateLayoutRouteStart(root, node, snapshots)) ||
      node.layout;
    const to = node.layout;
    return { from, to };
  }

  protected estimateLayoutRouteStart(
    root: MeasuredProjectionNode,
    node: MeasuredProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
  ): Layout | undefined {
    if (!node.measured()) throw new Error('Unknown node');

    let ancestor: ProjectionNode = node;
    let ancestorSnapshot: ProjectionNodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = snapshots.get(ancestor.id)) === undefined) {
      if (ancestor === root || !ancestor.parent) return;
      ancestor = ancestor.parent;
    }
    if (!ancestor.measured()) throw new Error('Unknown ancestor');

    const transform = ancestor.calculateTransform(ancestorSnapshot.layout);
    const scale = transform.x.scale;

    return new Layout({
      top:
        ancestorSnapshot.layout.top -
        (ancestor.layout.top - node.layout.top) * scale,
      left:
        ancestorSnapshot.layout.left -
        (ancestor.layout.left - node.layout.left) * scale,
      right:
        ancestorSnapshot.layout.right -
        (ancestor.layout.right - node.layout.right) * scale,
      bottom:
        ancestorSnapshot.layout.top -
        (ancestor.layout.top - node.layout.bottom) * scale,
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

  snapshot(options?: ProjectionTreeSnapshotOptions): void {
    const snapshots = this.snapper.snapshotTree(this.node, options);
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

export class CssEasingParser {
  parse(easing: string): Easing {
    if (easing === 'linear') {
      return linear;
    } else if (easing === 'ease') {
      return easeInOut;
    } else if (easing === 'ease-in') {
      return easeIn;
    } else if (easing === 'ease-out') {
      return easeOut;
    } else if (easing === 'ease-in-out') {
      return easeInOut;
    } else if (easing.startsWith('cubic-bezier')) {
      const [a, b, c, d] = easing
        .replace('cubic-bezier(', '')
        .replace(')', '')
        .split(',')
        .map((v) => parseFloat(v));
      return cubicBezier(a, b, c, d);
    }
    throw new Error(`Unsupported easing string: ${easing}`);
  }
}
