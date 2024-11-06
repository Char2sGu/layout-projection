import { Layout } from '../../layout.js';
import { ProjectionNodeBehavior } from '../../projection-node-behavior.js';
import {
  Measurement,
  Projection,
  ProjectionNode,
} from '../../projection-node-experimental.js';
import { BorderRadiusConfig, BorderRadiusCornerConfig } from './config.js';
import { BorderRadiusMeasurer } from './measurer.js';

interface ExtendedMeasurement extends Measurement {
  borderRadiuses: BorderRadiusConfig;
}

export class CalibrateBorderRadius extends ProjectionNodeBehavior {
  constructor(kernel: ProjectionNode, private measurer: BorderRadiusMeasurer) {
    super(kernel);
  }

  override measure(): ExtendedMeasurement {
    const result = super.measure() as ExtendedMeasurement;
    result.borderRadiuses = this.measurer.measure(this.kernel.element());
    return result;
  }

  override measurement(): ExtendedMeasurement | null {
    return super.measurement() as ExtendedMeasurement | null;
  }

  override project(dest: Layout): Projection {
    const projection = super.project(dest);
    const radiuses = this.measurement()?.borderRadiuses;
    if (!radiuses) throw new Error('Measurement not found');
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
