import { Measurement, ProjectionNode } from '../../projection-node.js';
import { ProjectionNodeBehavior } from '../../projection-node-behavior.js';
import { MeasurementWithBorderRadiuses } from './measurement.js';
import { BorderRadiusMeasurer } from './measurer.js';

/**
 * A behavior that additionally measures the border radiuses of the element when
 * the node is measured.
 * @see {@link MeasurementWithBorderRadiuses}
 */
export class MeasureBorderRadius extends ProjectionNodeBehavior {
  constructor(kernel: ProjectionNode, private measurer: BorderRadiusMeasurer) {
    super(kernel);
  }

  override measure(): Measurement {
    const result = super.measure() as MeasurementWithBorderRadiuses;
    result.borderRadiuses = this.measurer.measure(this.kernel.element());
    return result;
  }
}
