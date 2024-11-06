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
  constructor(kernel: ProjectionNode) {
    super(kernel);
  }

  override project(dest: Layout): Projection {
    const projection = super.project(dest);
    const measurement = this.measurement();
    if (!measurement) throw new Error('Measurement not found');
    if (!isBorderRadiusesMeasured(measurement)) return projection;
    const radiuses = measurement.borderRadiuses;
    const scaleX = projection.transform.x.scale;
    const scaleY = projection.transform.y.scale;
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / scaleX}px ${radius.y / scaleY}px`;
    const element = this.element();
    element.style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    element.style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    element.style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    element.style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);
    return projection;
  }
}
