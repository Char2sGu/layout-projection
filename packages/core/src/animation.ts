import {
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  Easing,
  linear,
} from 'popmotion';

import { BoundingBox } from './core.js';
import { NodeMeasurer } from './measure.js';
import { Node } from './node.js';
import {
  AnimationRef,
  NodeAnimationEngine,
  NodeAnimationPlan,
} from './node-animation.js';
import { NodeSnapshot, NodeSnapshotMap } from './snapshot.js';

export class LayoutAnimator {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  constructor(
    protected engine: NodeAnimationEngine,
    protected measurer: NodeMeasurer,
    protected easingParser: CssEasingParser,
  ) {}

  animate(config: LayoutAnimationConfig): AnimationRef {
    const { root } = config;
    this.pendingAnimations.get(root)?.stop();
    this.initialize(root);

    const plans = this.getAnimationPlanMap(config);
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

// TODO: move
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

class NodeAnimationPlanMap extends Map<Node['id'], NodeAnimationPlan> {}
