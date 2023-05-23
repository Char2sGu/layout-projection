import { BoundingBox } from './shared.js';

export interface DistortionCanceler<MeasureResult> {
  measure(element: HTMLElement, boundingBox: BoundingBox): MeasureResult;
  cancel(
    element: HTMLElement,
    context: DistortionCancellationContext<MeasureResult>,
  ): void;
}

export interface DistortionCancellationContext<MeasureResult> {
  measured: MeasureResult;
  scaleX: number;
  scaleY: number;
}
