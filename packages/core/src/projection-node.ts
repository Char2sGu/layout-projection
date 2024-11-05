import { Layout } from './layout.js';
import {
  ProjectionComponent,
  ProjectionDistortion,
} from './projection-component.js';
import { TransformAxisConfig, TransformConfig } from './transform.js';

/**
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export class ProjectionNode {
  static idNext = 1;

  id = `anonymous-${ProjectionNode.idNext++}`;
  activated = true;

  parent?: ProjectionNode;
  children = new Set<ProjectionNode>();

  layout?: Layout;
  transform?: TransformConfig;

  protected identified = false;

  private readonly tags = new Set<string>();

  constructor(
    public element: HTMLElement,
    protected components: ProjectionComponent[] = [],
  ) {}

  /**
   * Assign a ID to this projection node. The ID cannot be assigned again.
   * @throws Error if an ID has already been assigned.
   */
  identifyAs(id: string): void {
    if (this.identified)
      throw new Error(`Node "${this.id}" already identified`);
    this.id = id;
    this.identified = true;
  }

  activate(): void {
    this.activated = true;
  }
  deactivate(): void {
    this.activated = false;
  }

  /**
   * Attach this node as a child of the given parent node.
   * One projection node can only have one parent.
   * @param parent another projection node
   */
  attach(parent: ProjectionNode): void {
    this.parent = parent;
    parent.children.add(this);
  }
  /**
   * Detach this node from its current parent.
   * @throws Error if no parent.
   *
   * @remarks
   * A node must be detached from its parent on disposal, or memory
   * leak will occur.
   */
  detach(): void {
    if (!this.parent) throw new Error('Missing parent');
    this.parent.children.delete(this);
    this.parent = undefined;
  }

  /**
   * Add an arbitrary string tag to this projection node.
   * @see `AnimationTag` for tags related to animations.
   */
  addTag(tag: string): void {
    this.tags.add(tag);
  }
  /**
   * Delete a tag from this projection node.
   * Do nothing if the tag does not exist.
   */
  delTag(tag: string): void {
    this.tags.delete(tag);
  }
  /**
   * Returns whether this projection node has the given tag.
   */
  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  /**
   * Traverse down the node tree starting from this node.
   * @param callback invoked on each node
   */
  traverse(
    callback: (node: ProjectionNode) => void,
    options: ProjectionNodeTraverseOptions = {},
  ): void {
    options.includeSelf ??= false;
    options.includeDeactivated ??= false;

    if (options.includeSelf) callback(this);

    this.children.forEach((child) => {
      if (!options.includeDeactivated && !child.activated) return;
      child.traverse(callback, { ...options, includeSelf: true });
    });
  }

  /**
   * Track the path from the root node to this node.
   * @returns an array of nodes, where the first element is the root node and
   * the last element is this node.
   */
  track(): ProjectionNode[] {
    const path = [];
    let ancestor = this.parent;
    while (ancestor) {
      path.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return path;
  }

  /**
   * Reset any transform applied to the element.
   */
  reset(): void {
    this.transform = undefined;
    this.element.style.transform = '';
    // TODO: should delegate to ProjectionComponent
    this.element.style.borderRadius = '';
  }

  measure(): void {
    const layout = Layout.from(this.element);
    this.layout = layout;
    this.components.forEach((c) =>
      Object.assign(this, c.measureProperties(this.element, layout)),
    );
  }
  measured(): this is MeasuredProjectionNode {
    return !!this.layout;
  }

  project(destLayout: Layout): void {
    if (!this.measured()) throw new Error('Node not measured');

    this.transform = this.calculateTransform(destLayout);

    const ancestorTotalScale = { x: 1, y: 1 };
    const ancestors = this.track();
    for (const ancestor of ancestors) {
      if (!ancestor.transform) continue;
      ancestorTotalScale.x *= ancestor.transform.x.scale;
      ancestorTotalScale.y *= ancestor.transform.y.scale;
    }

    const transform = this.transform;
    const translateX = transform.x.translate / ancestorTotalScale.x;
    const translateY = transform.y.translate / ancestorTotalScale.y;
    this.element.style.transform = [
      `translate3d(${translateX}px, ${translateY}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    const distortion: ProjectionDistortion = {
      scaleX: ancestorTotalScale.x * this.transform.x.scale,
      scaleY: ancestorTotalScale.y * this.transform.y.scale,
    };
    this.components.forEach((c) => {
      c.cancelDistortion(this.element, this, distortion);
    });
  }

  calculateTransform(destLayout: Layout): TransformConfig {
    const currLayout = this.calculateTransformedLayout();
    const currMidpoint = currLayout.midpoint();
    const destMidpoint = destLayout.midpoint();

    const transform: TransformConfig = {
      x: new TransformAxisConfig({
        origin: currMidpoint.x,
        scale: destLayout.width() / currLayout.width(),
        translate: destMidpoint.x - currMidpoint.x,
      }),
      y: new TransformAxisConfig({
        origin: currMidpoint.y,
        scale: destLayout.height() / currLayout.height(),
        translate: destMidpoint.y - currMidpoint.y,
      }),
    };

    // edge case: invisible element (width/height is 0)
    if (isNaN(transform.x.scale)) transform.x.scale = 1;
    if (isNaN(transform.y.scale)) transform.y.scale = 1;

    return transform;
  }

  calculateTransformedLayout(): Layout {
    if (!this.measured()) throw new Error('Node not measured');
    let layout = this.layout;
    for (const ancestor of this.track()) {
      if (!ancestor.layout || !ancestor.transform) continue;
      const transform = ancestor.transform;
      layout = new Layout({
        top: transform.y.apply(layout.top),
        left: transform.x.apply(layout.left),
        right: transform.x.apply(layout.right),
        bottom: transform.y.apply(layout.bottom),
      });
    }
    return layout;
  }

  [prop: PropertyKey]: unknown;
}
export type MeasuredProjectionNode = ProjectionNode &
  Required<Pick<ProjectionNode, 'layout'>>;

export interface ProjectionNodeTraverseOptions {
  /**
   * Whether to include the given node itself in the traversal.
   */
  includeSelf?: boolean;

  /**
   * Whether to include deactivated nodes in the traversal.
   */
  includeDeactivated?: boolean;
}
