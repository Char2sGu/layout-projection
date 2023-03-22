import { Directive, Input, OnDestroy, Self } from '@angular/core';
import { LayoutAnimationConfig, Node } from '@layout-projection/core';

import { LayoutAnimationDirective } from './layout-animation.directive';

@Directive({
  selector: '[lpjNode][lpjAnimation],[lpjNode][animateOn],[lpjNode][animated]',
})
export class LayoutAnimationConfigDirective implements OnDestroy {
  @Input() animationDuration: LayoutAnimationConfig['duration'] = 225;
  @Input() animationEasing: LayoutAnimationConfig['easing'] = 'ease-in-out';

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
