import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { Node, NodeMeasurer } from '@layout-projection/core';

@Directive({
  selector: '[lpjNode]',
  exportAs: 'lpjNode',
  providers: [{ provide: Node, useExisting: NodeDirective }],
})
export class NodeDirective extends Node implements OnDestroy {
  @Input() set lpjNode(v: string | false) {
    if (typeof v === 'string') {
      if (v) this.identifyAs(v);
      this.activate();
    } else {
      this.deactivate();
    }
  }

  constructor(
    elementRef: ElementRef<HTMLElement>,
    measurer: NodeMeasurer,
    @SkipSelf() @Optional() parent?: Node,
  ) {
    super(elementRef.nativeElement, measurer);
    if (parent) this.attach(parent);
  }

  ngOnDestroy(): void {
    if (this.parent) this.detach();
  }
}
