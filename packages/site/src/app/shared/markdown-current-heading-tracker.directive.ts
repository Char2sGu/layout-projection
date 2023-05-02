import {
  Directive,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HISTORY, LOCATION } from '@ng-web-apis/common';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  switchMap,
  takeUntil,
} from 'rxjs';

import { HeadingComponent } from '../markdown-elements/heading/heading.component';
import { CustomElementComponentRegistry } from '../markdown-elements/shared/custom-element';

@Directive({
  selector: '[lpjMarkdownCurrentHeadingTracker]',
  standalone: true,
})
export class MarkdownCurrentHeadingTrackerDirective
  implements OnInit, OnDestroy
{
  headingId$: Observable<string | undefined>;

  private destroy = new EventEmitter();

  constructor(
    @Inject(LOCATION) private location: Location,
    @Inject(HISTORY) private history: History,
    private customElementComponentRegistry: CustomElementComponentRegistry,
  ) {
    this.headingId$ = this.customElementComponentRegistry.update$.pipe(
      debounceTime(50),
      map(() => this.customElementComponentRegistry),
      map((set) =>
        [...set]
          .filter((c): c is HeadingComponent => c instanceof HeadingComponent)
          .map((c) => c.visibility$.pipe(map((v) => ({ id: c.id, v })))),
      ),
      switchMap((entries) => combineLatest(entries)),
      debounceTime(500),
      map((visibilities) => visibilities.find(({ v }) => v)?.id),
    );
  }

  ngOnInit(): void {
    this.headingId$
      .pipe(takeUntil(this.destroy), filter(Boolean))
      .subscribe((id) => {
        this.history.replaceState(null, '', `${this.location.pathname}#${id}`);
      });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
