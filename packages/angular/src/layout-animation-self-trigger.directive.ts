import { Directive, Self } from '@angular/core';
import { LayoutAnimationEntry } from '@layout-projection/core';

import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';

@Directive({
  selector: '[lpjAnimation][lpjAnimationTrigger]',
  standalone: true,
})
export class LayoutAnimationSelfTriggerDirective {
  constructor(
    @Self() entry: LayoutAnimationEntry,
    @Self() trigger: LayoutAnimationTriggerDirective,
  ) {
    trigger.lpjAnimationTriggerFor = entry;
  }
}
