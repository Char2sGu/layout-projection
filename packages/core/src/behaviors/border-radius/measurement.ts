import { Measurement } from '../../projection-node.js';
import { BorderRadiusConfig } from './config.js';

export interface MeasurementWithBorderRadiuses extends Measurement {
  borderRadiuses: BorderRadiusConfig;
}

export function isBorderRadiusesMeasured<M extends Measurement>(
  measurement: M,
): measurement is M & MeasurementWithBorderRadiuses {
  return 'borderRadiuses' in measurement;
}
