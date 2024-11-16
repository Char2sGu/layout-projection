import { createInjectiveInstanceFactory } from '../../injective-instance-factory.js';
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
  /**
   * Returns a behavior instance of the given node.
   * If exists, returns the previous behavior instance of this node.
   */
  static for = createInjectiveInstanceFactory(
    /**
     * @param measurerPreferred the measurer to use when there does not
     * exist a previous behavior instance of this node.
     */
    (node: ProjectionNode, measurerPreferred: BorderRadiusMeasurer) =>
      new MeasureBorderRadius(node, measurerPreferred),
  );

  protected constructor(
    kernel: ProjectionNode,
    private measurer: BorderRadiusMeasurer,
  ) {
    super(kernel);
  }

  override measure(): Measurement {
    const result = super.measure() as MeasurementWithBorderRadiuses;
    result.borderRadiuses = this.measurer.measure(this.element());
    return result;
  }

  protected override decorate(target: ProjectionNode): this {
    return MeasureBorderRadius.for(target, this.measurer) as this;
  }
}
