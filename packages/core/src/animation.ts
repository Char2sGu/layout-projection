import { easeInOut, Easing } from 'popmotion';

import {
  AnimationRef,
  NodeAnimationPlanMap,
  TreeAnimationEngine,
} from './animation-engines.js';
import { BoundingBox } from './core.js';
import { CssEasingParser } from './css.js';
import { NodeMeasurer } from './measure.js';
import { Node } from './node.js';
import { NodeSnapshot, NodeSnapshotMap } from './snapshot.js';

export class LayoutAnimator {
  constructor(
    protected engine: TreeAnimationEngine,
    protected measurer: NodeMeasurer,
    protected easingParser: CssEasingParser,
  ) {}

  animate(config: LayoutAnimationConfig): AnimationRef {
    this.initialize(config.root);
    const plans = this.getAnimationPlanMap(config);
    return this.engine.animate(config.root, plans);
  }

  protected initialize(root: Node): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    root.traverse((node) => node.reset(), { includeSelf: true });
    root.traverse((node) => node.measure(), { includeSelf: true });
  }

  protected getAnimationPlanMap(
    config: LayoutAnimationConfig,
  ): NodeAnimationPlanMap {
    const { root, from: snapshots } = config;
    if (typeof config.easing === 'string')
      config.easing = this.easingParser.parse(config.easing);
    const { duration = 225, easing = easeInOut } = config;

    const map = new NodeAnimationPlanMap();

    root.traverse(
      (node) => {
        if (!node.measured()) throw new Error('Unknown node');

        const snapshot = snapshots.get(node.id);
        // This is the old node instance in a shared-element layout animation,
        // it should share the same animation config with the new instance.
        if (map.has(node.id) && node.element === snapshot?.element) return;

        const boundingBoxFrom =
          snapshot?.boundingBox ??
          this.estimateStartingBoundingBox(root, node, snapshots) ??
          node.boundingBox;
        const boundingBoxTo = node.boundingBox;

        const borderRadiusesFrom =
          snapshot?.borderRadiuses ??
          this.measurer.measureBorderRadiuses(node.element, node.boundingBox);
        const borderRadiusesTo = node.borderRadiuses;

        map.set(node.id, {
          duration,
          easing,
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
    root: Node,
    node: Node,
    snapshots: NodeSnapshotMap,
  ): BoundingBox | undefined {
    if (!node.measured()) throw new Error('Unknown node');

    let ancestor: Node = node;
    let ancestorSnapshot: NodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = snapshots.get(ancestor.id)) === undefined) {
      if (!ancestor.parent) return;
      ancestor = ancestor.parent;
      if (ancestor === root) return;
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
  root: Node;
  from: NodeSnapshotMap;
  duration?: number;
  easing?: string | Easing;
}
