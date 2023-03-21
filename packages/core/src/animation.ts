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
import { NodeMeasurer } from './measurement.js';
import { Node } from './node.js';
import { NodeSnapshot, NodeSnapshotMap } from './snapshot.js';

export class LayoutAnimator {
  protected animationStopper?: () => void;

  constructor(
    public root: Node,
    protected measurer: NodeMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  async animate(
    from: NodeSnapshotMap,
    duration: number,
    easing: string | Easing,
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.animationStopper) {
        this.animationStopper();
        this.animationStopper = undefined;
      }

      const animationConfigMap = this.getAnimationConfigMap(from);

      const projectFrame = (progress: number) =>
        this.projectFrame(animationConfigMap, progress);

      projectFrame(0);
      const { stop } = animate({
        from: 0,
        to: 1,
        duration,
        ease: this.easingParser.coerceEasing(easing),
        onUpdate: projectFrame,
        onComplete: () => {
          this.root.traverse((node) => node.reset(), { includeSelf: true });
          resolve();
        },
        onStop: resolve,
      });
      this.animationStopper = stop;
    });
  }

  protected projectFrame(
    configMap: NodeAnimationConfigMap,
    progress: number,
  ): void {
    this.root.traverse(
      (node) => {
        const config = configMap.get(node.id);
        if (!config) throw new Error('Unknown node');
        const boundingBox = this.getFrameBoundingBox(config, progress);
        const borderRadiuses = this.getFrameBorderRadiuses(config, progress);
        node.transform = node.calculateTransform(boundingBox);
        node.borderRadiuses = borderRadiuses;
      },
      { includeSelf: true },
    );

    this.root.project();
  }

  protected getAnimationConfigMap(
    snapshots: NodeSnapshotMap,
  ): NodeAnimationConfigMap {
    this.measureTree();

    const map = new NodeAnimationConfigMap();

    this.root.traverse(
      (node) => {
        if (!node.boundingBox || !node.borderRadiuses)
          throw new Error('Unknown node');

        const snapshot = snapshots.get(node.id);
        // This is the old node instance in a shared-element layout animation,
        // it should share the same animation config with the new instance.
        if (map.has(node.id) && node.element === snapshot?.element) return;

        const boundingBoxFrom =
          snapshot?.boundingBox ??
          this.estimateStartingBoundingBox(snapshots, node) ??
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

  protected measureTree(): void {
    // We have to perform the dom-write actions and dom-read actions separately
    // to avoid layout thrashing.
    // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
    this.root.traverse((node) => node.reset(), { includeSelf: true });
    this.root.traverse((node) => node.measure(), { includeSelf: true });
  }

  protected getFrameBoundingBox(
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

  protected getFrameBorderRadiuses(
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

  protected estimateStartingBoundingBox(
    snapshots: NodeSnapshotMap,
    node: Node,
  ): BoundingBox | undefined {
    if (!node.boundingBox) throw new Error('Unknown node');

    let ancestor = node;
    let ancestorSnapshot: NodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = snapshots.get(ancestor.id)) === undefined) {
      if (!ancestor.parent) return;
      ancestor = ancestor.parent;
      if (ancestor === this.root) return;
    }
    if (!ancestor.boundingBox) throw new Error('Unknown ancestor');

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
