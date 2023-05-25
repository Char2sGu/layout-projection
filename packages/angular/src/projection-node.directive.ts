import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { ProjectionComponent, ProjectionNode } from '@layout-projection/core';

import { PROJECTION_COMPONENTS } from './layout-projection.module';

@Directive({
  selector: '[lpjNode]',
  exportAs: 'lpjNode',
  standalone: true,
  providers: [
    {
      provide: ProjectionNode,
      useExisting: ProjectionNodeDirective,
    },
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
    @Inject(PROJECTION_COMPONENTS) components: ProjectionComponent[],
    @SkipSelf() @Optional() parent?: ProjectionNode,
  ) {
    super(elementRef.nativeElement, components);
    if (parent) this.attach(parent);
  }

  ngOnDestroy(): void {
    if (this.parent) this.detach();
  }
}
