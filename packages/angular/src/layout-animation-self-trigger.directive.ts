import { Directive, Self } from '@angular/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';

@Directive({
  selector: '[lpjAnimation][lpjAnimationTrigger]',
  standalone: true,
})
export class LayoutAnimationSelfTriggerDirective {
  constructor(
    @Self() entry: LayoutAnimationEntryDirective,
    @Self() trigger: LayoutAnimationTriggerDirective,
  ) {
    trigger.lpjAnimationTriggerFor = entry.node;
  }
}
