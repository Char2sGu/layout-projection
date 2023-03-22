import {
  animate,
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  Easing,
  linear,
  mix,
} from 'popmotion';

import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './core.js';
import { NodeMeasurer } from './measure.js';
import { Node } from './node.js';
import { NodeSnapshot, NodeSnapshotMap } from './snapshot.js';

export class LayoutAnimator {
  protected animationStoppers = new WeakMap<Node, () => void>();

  constructor(
    protected measurer: NodeMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  async animate(config: LayoutAnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      const { root, from: snapshots, duration, easing } = config;

      this.animationStoppers.get(root)?.();

      this.initialize(root);
      const configs = this.getAnimationConfigMap(root, snapshots);

      const projectFrame = (progress: number) =>
        root.traverse(
          (node) => this.projectNodeForFrame(node, configs, progress),
          { includeSelf: true },
        );

      projectFrame(0);
      const { stop } = animate({
        from: 0,
        to: 1,
        duration,
        ease: this.easingParser.coerceEasing(easing),
        onUpdate: projectFrame,
        onComplete: () => {
          root.traverse((node) => node.reset(), { includeSelf: true });
          resolve();
        },
        onStop: resolve,
      });

      this.animationStoppers.set(root, stop);
    });
  }

  protected initialize(root: Node): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    root.traverse((node) => node.reset(), { includeSelf: true });
    root.traverse((node) => node.measure(), { includeSelf: true });
  }

  protected getAnimationConfigMap(
    root: Node,
    snapshots: NodeSnapshotMap,
  ): NodeAnimationConfigMap {
    const map = new NodeAnimationConfigMap();

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

  protected projectNodeForFrame(
    node: Node,
    configMap: NodeAnimationConfigMap,
    progress: number,
  ): void {
    const config = configMap.get(node.id);
    if (!config) throw new Error('Unknown node');
    const boundingBox = this.getNodeBoundingBoxForFrame(config, progress);
    const borderRadiuses = this.getNodeBorderRadiusesForFrame(config, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected getNodeBoundingBoxForFrame(
    config: NodeAnimationConfig,
    progress: number,
  ): BoundingBox {
    const from = config.boundingBoxFrom;
    const to = config.boundingBoxTo;
    return new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected getNodeBorderRadiusesForFrame(
    config: NodeAnimationConfig,
    progress: number,
  ): BorderRadiusConfig {
    const from = config.borderRadiusesFrom;
    const to = config.borderRadiusesTo;

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

export interface LayoutAnimationConfig {
  root: Node;
  from: NodeSnapshotMap;
  duration: number;
  easing: string | Easing;
}

export class LayoutAnimationEasingParser {
  coerceEasing(raw: string | Easing): Easing {
    return typeof raw === 'string' ? this.parseEasing(raw) : raw;
  }

  parseEasing(easing: string): Easing {
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

class NodeAnimationConfigMap extends Map<Node['id'], NodeAnimationConfig> {}

interface NodeAnimationConfig {
  boundingBoxFrom: BoundingBox;
  boundingBoxTo: BoundingBox;
  borderRadiusesFrom: BorderRadiusConfig;
  borderRadiusesTo: BorderRadiusConfig;
}
