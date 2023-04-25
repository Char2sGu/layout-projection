import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { ElementMeasurer, ProjectionNode } from '@layout-projection/core';

@Directive({
  selector: '[lpjNode]',
  exportAs: 'lpjNode',
  standalone: true,
  providers: [
    { provide: ProjectionNode, useExisting: ProjectionNodeDirective },
  ],
})
export class ProjectionNodeDirective
  extends ProjectionNode
  implements OnDestroy
{
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
    measurer: ElementMeasurer,
    @SkipSelf() @Optional() parent?: ProjectionNode,
  ) {
    super(elementRef.nativeElement, measurer);
    if (parent) this.attach(parent);
  }

  ngOnDestroy(): void {
    if (this.parent) this.detach();
  }
}
