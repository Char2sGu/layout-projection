import { LayoutAnimationConfig as Base } from '@layout-projection/core';

export interface LayoutAnimationConfig
  extends Partial<Pick<Base, 'easing' | 'duration'>> {}
