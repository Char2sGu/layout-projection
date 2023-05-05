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
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

import { HeadingComponent } from '../markdown-elements/heading/heading.component';
import { CustomElementComponentRegistry } from '../markdown-elements/shared/custom-element';

@Directive({
  selector: '[lpj-markdown][headingTracking]',
  standalone: true,
})
export class MarkdownHeadingTrackingDirective implements OnInit, OnDestroy {
  headings$: Observable<HeadingComponent[]>;
  currentId$: Observable<string | undefined>;

  private destroy = new EventEmitter();

  constructor(
    @Inject(LOCATION) private location: Location,
    @Inject(HISTORY) private history: History,
    private customElementComponentRegistry: CustomElementComponentRegistry,
  ) {
    this.headings$ = this.customElementComponentRegistry.update$.pipe(
      debounceTime(0),
      map(() => [...this.customElementComponentRegistry]),
      map((arr) =>
        arr.filter((c): c is HeadingComponent => c instanceof HeadingComponent),
      ),
      shareReplay(1),
    );
    this.currentId$ = this.headings$.pipe(
      map((headings) =>
        headings.map((c) => c.visibility$.pipe(map((v) => ({ id: c.id, v })))),
      ),
      switchMap((entries) => combineLatest(entries).pipe(debounceTime(150))),
      map((visibilities) => visibilities.find(({ v }) => v)?.id),
      shareReplay(1),
    );
  }

  ngOnInit(): void {
    this.currentId$
      .pipe(takeUntil(this.destroy), filter(Boolean))
      .subscribe((id) => {
        this.history.replaceState(null, '', `${this.location.pathname}#${id}`);
      });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
