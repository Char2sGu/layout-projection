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
  static #instances = new WeakMap<ProjectionNode, MeasureBorderRadius>();

  /**
   * Returns a behavior instance of the given node.
   * If exists, returns the previous behavior instance of this node.
   * @param measurerPreferred the measurer to use when there does not
   * exist a previous behavior instance of this node.
   */
  static for(
    node: ProjectionNode,
    measurerPreferred: BorderRadiusMeasurer,
  ): MeasureBorderRadius {
    const existing = this.#instances.get(node);
    if (existing) return existing;
    const instance = new this(node, measurerPreferred);
    this.#instances.set(node, instance);
    return instance;
  }

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
