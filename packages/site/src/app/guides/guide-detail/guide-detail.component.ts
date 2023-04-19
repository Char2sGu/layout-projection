import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

import { HeadingComponent } from '../../markdown-elements/heading/heading.component';
import { CustomElementComponentRegistry } from '../../markdown-elements/shared/custom-element';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent implements OnInit, OnDestroy {
  filename$!: Observable<string>;
  currentHeaderId$!: Observable<string | undefined>;

  protected destroy = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    @Inject(LOCATION) private location: Location,
    @Inject(HISTORY) private history: History,
    private customElementComponentRegistry: CustomElementComponentRegistry,
  ) {}

  ngOnInit(): void {
    this.filename$ = this.route.params.pipe(
      map((params) => params['filename']),
    );

    this.currentHeaderId$ = this.customElementComponentRegistry.update$.pipe(
      debounceTime(500),
      map(() => this.customElementComponentRegistry),
      map((set) =>
        [...set]
          .filter((c): c is HeadingComponent => c instanceof HeadingComponent)
          .map((c) => c.visibility$.pipe(map((v) => ({ id: c.id, v })))),
      ),
      switchMap((entries) => combineLatest(entries)),
      map((visibilities) => visibilities.find(({ v }) => v)?.id),
    );

    this.currentHeaderId$
      .pipe(takeUntil(this.destroy), filter(Boolean))
      .subscribe((id) => {
        this.history.pushState(null, '', `${this.location.pathname}#${id}`);
      });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
