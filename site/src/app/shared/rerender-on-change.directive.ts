import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { distinctUntilChanged, Subject } from 'rxjs';

@Directive({
  selector: '[lpjRerenderOnChange]',
})
export class RerenderOnChangeDirective {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  // prettier-ignore
  @Input('lpjRerenderOnChange') set valueInput(value: unknown) { this.value$.next(value) }
  value$ = new Subject<unknown>();

  constructor() {
    this.render();
    this.value$.pipe(distinctUntilChanged()).subscribe(() => {
      this.render();
    });
  }

  render(): void {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
