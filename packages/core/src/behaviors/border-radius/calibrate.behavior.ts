import { Layout } from '../../layout.js';
import { Projection, ProjectionNode } from '../../projection-node.js';
import { ProjectionNodeBehavior } from '../../projection-node-behavior.js';
import { BorderRadiusCornerConfig } from './config.js';
import { isBorderRadiusesMeasured } from './measurement.js';

/**
 * A behavior that additionally calibrates the distortion of the border radius
 * styles of the element when projecting.
 * Requires the measurement to satisfy {@link MeasurementWithBorderRadiuses}.
 * Noop otherwise.
 */
export class CalibrateBorderRadius extends ProjectionNodeBehavior {
  static #instances = new WeakMap<ProjectionNode, CalibrateBorderRadius>();

  /**
   * Returns a behavior instance of the given node.
   * If exists, returns the previous behavior instance of this node.
   */
  static for(node: ProjectionNode): CalibrateBorderRadius {
    const existing = this.#instances.get(node);
    if (existing) return existing;
    const instance = new this(node);
    this.#instances.set(node, instance);
    return instance;
  }

  protected constructor(kernel: ProjectionNode) {
    super(kernel);
  }

  override reset(): void {
    super.reset();
    this.element().style.borderRadius = '';
  }

  override project(dest: Layout): Projection {
    const projection = super.project(dest);
    const measurement = this.measurement();
    if (!measurement) throw new Error('Measurement not found');
    if (!isBorderRadiusesMeasured(measurement)) return projection;
    const radiuses = measurement.borderRadiuses;
    const scaleX = projection.transformApplied.x.scale;
    const scaleY = projection.transformApplied.y.scale;
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / scaleX}px ${radius.y / scaleY}px`;
    const element = this.element();
    element.style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    element.style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    element.style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    element.style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);
    return projection;
  }

  protected override decorate(target: ProjectionNode): this {
    return CalibrateBorderRadius.for(target) as this;
  }
}
