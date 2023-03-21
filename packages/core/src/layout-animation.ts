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
  LayoutBorderRadius,
  LayoutBorderRadiuses,
  LayoutBoundingBox,
} from './core.js';
import { LayoutMeasurer } from './layout-measurement.js';
import { LayoutProjectionNode } from './layout-projection.js';
import { LayoutNodeSnapshot, LayoutSnapshot } from './layout-snapshot.js';

export class LayoutAnimator {
  protected animationStopper?: () => void;

  constructor(
    public root: LayoutProjectionNode,
    protected measurer: LayoutMeasurer,
    protected easingParser: LayoutAnimationEasingParser,
  ) {}

  async animate(
    from: LayoutSnapshot,
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
        node.calculate(boundingBox);
        node.borderRadiuses = borderRadiuses;
      },
      { includeSelf: true },
    );

    this.root.project();
  }

  protected getAnimationConfigMap(
    layoutSnapshot: LayoutSnapshot,
  ): NodeAnimationConfigMap {
    this.root.measure();

    const map = new NodeAnimationConfigMap();

    this.root.traverse(
      (node) => {
        if (!node.boundingBox || !node.borderRadiuses)
          throw new Error('Unknown node');

        const nodeSnapshot = layoutSnapshot.get(node.id);
        // This is the old node instance in a shared-element layout animation,
        // it should share the same animation config with the new instance.
        if (map.has(node.id) && node.element === nodeSnapshot?.element) return;

        const boundingBoxFrom =
          nodeSnapshot?.boundingBox ??
          this.estimateStartingBoundingBox(layoutSnapshot, node) ??
          node.boundingBox;
        const boundingBoxTo = node.boundingBox;

        const borderRadiusesFrom =
          nodeSnapshot?.borderRadiuses ??
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

  protected getFrameBoundingBox(
    config: NodeAnimationConfig,
    progress: number,
  ): LayoutBoundingBox {
    const from = config.boundingBoxFrom;
    const to = config.boundingBoxTo;
    return new LayoutBoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected getFrameBorderRadiuses(
    config: NodeAnimationConfig,
    progress: number,
  ): LayoutBorderRadiuses {
    const from = config.borderRadiusesFrom;
    const to = config.borderRadiusesTo;

    const mixRadius = (
      from: LayoutBorderRadius,
      to: LayoutBorderRadius,
      progress: number,
    ): LayoutBorderRadius => ({
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
    layoutSnapshot: LayoutSnapshot,
    node: LayoutProjectionNode,
  ): LayoutBoundingBox | undefined {
    if (!node.boundingBox) throw new Error('Unknown node');

    let ancestor = node;
    let ancestorSnapshot: LayoutNodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = layoutSnapshot.get(ancestor.id)) === undefined) {
      if (!ancestor.parent) return;
      ancestor = ancestor.parent;
      if (ancestor === this.root) return;
    }
    if (!ancestor.boundingBox) throw new Error('Unknown ancestor');

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    ancestor.calculate(ancestorSnapshot.boundingBox);
    const transform = ancestor.boundingBoxTransform!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    const scale = transform.x.scale;

    return new LayoutBoundingBox({
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

class NodeAnimationConfigMap extends Map<
  LayoutProjectionNode['id'],
  NodeAnimationConfig
> {}

interface NodeAnimationConfig {
  boundingBoxFrom: LayoutBoundingBox;
  boundingBoxTo: LayoutBoundingBox;
  borderRadiusesFrom: LayoutBorderRadiuses;
  borderRadiusesTo: LayoutBorderRadiuses;
}
