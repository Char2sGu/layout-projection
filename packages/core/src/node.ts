import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
  BoundingBoxAxisTransform,
  BoundingBoxTransform,
} from './core.js';
import { NodeMeasurer } from './measurement.js';

/**
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export class Node {
  static idNext = 1;

  id = `anonymous-${Node.idNext++}`;
  activated = false;

  parent?: Node;
  children = new Set<Node>();

  boundingBox?: BoundingBox;
  boundingBoxTransform?: BoundingBoxTransform;

  borderRadiuses?: BorderRadiusConfig;

  constructor(public element: HTMLElement, protected measurer: NodeMeasurer) {}

  identifyAs(id: string): void {
    this.id = id;
  }

  activate(): void {
    this.activated = true;
  }
  deactivate(): void {
    this.activated = false;
  }

  attach(parent: Node): void {
    this.parent = parent;
    parent.children.add(this);
  }
  detach(): void {
    if (!this.parent) throw new Error('Missing parent');
    this.parent.children.delete(this);
    this.parent = undefined;
  }

  traverse(
    callback: (node: Node) => void,
    options: NodeTraverseOptions = {},
  ): void {
    options.includeSelf ??= false;
    options.includeDeactivated ??= false;

    if (options.includeSelf) callback(this);

    this.children.forEach((child) => {
      if (!options.includeDeactivated && !child.activated) return;
      child.traverse(callback, { ...options, includeSelf: true });
    });
  }
  track(): NodeTreePath {
    const path = [];
    let ancestor = this.parent;
    while (ancestor) {
      path.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return path;
  }

  reset(): void {
    this.element.style.transform = '';
    this.element.style.borderRadius = '';
  }

  measure(): void {
    this.boundingBox = this.measurer.measureBoundingBox(this.element);
    this.borderRadiuses = this.measurer.measureBorderRadiuses(
      this.element,
      this.boundingBox,
    );
  }

  calculate(destBoundingBox: BoundingBox): void {
    if (!this.boundingBox) throw new Error('Missing bounding box');

    const currBoundingBox = this.calibrate(this.boundingBox);
    const currMidpoint = currBoundingBox.midpoint();
    const destMidpoint = destBoundingBox.midpoint();

    this.boundingBoxTransform = {
      x: new BoundingBoxAxisTransform({
        origin: currMidpoint.x,
        scale: destBoundingBox.width() / currBoundingBox.width(),
        translate: destMidpoint.x - currMidpoint.x,
      }),
      y: new BoundingBoxAxisTransform({
        origin: currMidpoint.y,
        scale: destBoundingBox.height() / currBoundingBox.height(),
        translate: destMidpoint.y - currMidpoint.y,
      }),
    };

    // edge case: invisible element (width/height is 0)
    if (isNaN(this.boundingBoxTransform.x.scale))
      this.boundingBoxTransform.x.scale = 1;
    if (isNaN(this.boundingBoxTransform.y.scale))
      this.boundingBoxTransform.y.scale = 1;
  }

  calibrate(boundingBox: BoundingBox): BoundingBox {
    for (const ancestor of this.track()) {
      if (!ancestor.boundingBox || !ancestor.boundingBoxTransform) continue;
      const transform = ancestor.boundingBoxTransform;
      boundingBox = new BoundingBox({
        top: transform.y.apply(boundingBox.top),
        left: transform.x.apply(boundingBox.left),
        right: transform.x.apply(boundingBox.right),
        bottom: transform.y.apply(boundingBox.bottom),
      });
    }
    return boundingBox;
  }

  project(): void {
    if (!this.boundingBoxTransform) throw new Error('Missing transform');
    if (!this.borderRadiuses) throw new Error('Missing border radiuses');

    const ancestorTotalScale = { x: 1, y: 1 };
    const ancestors = this.track();
    for (const ancestor of ancestors) {
      if (!ancestor.boundingBoxTransform) continue;
      ancestorTotalScale.x *= ancestor.boundingBoxTransform.x.scale;
      ancestorTotalScale.y *= ancestor.boundingBoxTransform.y.scale;
    }

    const style = this.element.style;

    const transform = this.boundingBoxTransform;
    const translateX = transform.x.translate / ancestorTotalScale.x;
    const translateY = transform.y.translate / ancestorTotalScale.y;
    style.transform = [
      `translate3d(${translateX}px, ${translateY}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    const totalScale = {
      x: ancestorTotalScale.x * this.boundingBoxTransform.x.scale,
      y: ancestorTotalScale.y * this.boundingBoxTransform.y.scale,
    };

    const radiuses = this.borderRadiuses;
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / totalScale.x}px ${radius.y / totalScale.y}px`;
    style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);

    this.traverse((child) => child.project());
  }
}

export interface NodeTraverseOptions {
  includeSelf?: boolean;
  includeDeactivated?: boolean;
}

export class NodeTreePath extends Array<Node> {}
