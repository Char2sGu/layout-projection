import { Directive, Input, OnDestroy, Self } from '@angular/core';
import { Node } from '@layout-projection/core';

import { LayoutAnimationConfig } from './core';
import { LayoutAnimationDirective } from './layout-animation.directive';

@Directive({
  selector: '[lpjNode][lpjAnimation],[lpjNode][animateOn],[lpjNode][animation]',
})
export class LayoutAnimationConfigDirective implements OnDestroy {
  @Input() animation: LayoutAnimationConfig = {};

  constructor(
    @Self() public node: Node,
    private host: LayoutAnimationDirective,
  ) {
    this.host.animationConfigs.add(this);
  }

  ngOnDestroy(): void {
    this.host.animationConfigs.delete(this);
  }
}
