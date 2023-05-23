import { BoundingBox } from './shared.js';

export interface DistortionCanceler<Properties extends object> {
  measure(element: HTMLElement, boundingBox: BoundingBox): Properties;
  cancel(
    element: HTMLElement,
    context: DistortionCancellationContext<Properties>,
  ): void;
}

export interface DistortionCancellationContext<Properties extends object> {
  measured: Properties;
  scaleX: number;
  scaleY: number;
}
