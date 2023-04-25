import { easeInOut, Easing } from 'popmotion';

import {
  AnimationRef,
  ProjectionNodeAnimationRouteMap,
  ProjectionTreeAnimationEngine,
} from './animation-engines.js';
import { CssEasingParser } from './css.js';
import { ElementMeasurer } from './measure.js';
import { ProjectionNode } from './projection.js';
import { BoundingBox } from './shared.js';
import {
  ProjectionNodeSnapper,
  ProjectionNodeSnapshot,
  ProjectionNodeSnapshotMap,
} from './snapshot.js';

export class LayoutAnimator {
  constructor(
    protected engine: ProjectionTreeAnimationEngine,
    protected measurer: ElementMeasurer,
    protected easingParser: CssEasingParser,
  ) {}

  animate(config: LayoutAnimationConfig): AnimationRef {
    const { root, from: snapshots, estimation = false } = config;
    if (typeof config.easing === 'string')
      config.easing = this.easingParser.parse(config.easing);
    const { duration = 225, easing = easeInOut } = config;

    this.initialize(root);
    const routes = this.getAnimationRouteMap(root, snapshots, estimation);
    const ref = this.engine.animate(root, { duration, easing, routes });

    ref.then(() => {
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

  protected getAnimationRouteMap(
    root: ProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
    estimation: boolean,
  ): ProjectionNodeAnimationRouteMap {
    const map = new ProjectionNodeAnimationRouteMap();

    root.traverse(
      (node) => {
        if (!node.measured()) throw new Error('Unknown node');

        const snapshot = snapshots.get(node.id);
        // This is the old node instance in a shared-element layout animation,
        // it should share the same animation config with the new instance.
        if (map.has(node.id) && node.element === snapshot?.element) return;

        const boundingBoxFrom =
          snapshot?.boundingBox ||
          (estimation &&
            this.estimateStartingBoundingBox(root, node, snapshots)) ||
          node.boundingBox;
        const boundingBoxTo = node.boundingBox;

        const borderRadiusesFrom =
          snapshot?.borderRadiuses ?? node.borderRadiuses;
        const borderRadiusesTo = node.borderRadiuses;

        map.set(node.id, {
          boundingBoxFrom,
          boundingBoxTo,
          borderRadiusesFrom,
          borderRadiusesTo,
        });
      },
      { includeSelf: true },
    );

    return map;
  }

  protected estimateStartingBoundingBox(
    root: ProjectionNode,
    node: ProjectionNode,
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
