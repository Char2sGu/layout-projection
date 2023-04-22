import { DOCUMENT } from '@angular/common';
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
  skip,
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
  filepath$!: Observable<string>;
  currentHeaderId$!: Observable<string | undefined>;
  ready = new EventEmitter();

  protected destroy = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCATION) private location: Location,
    @Inject(HISTORY) private history: History,
    private customElementComponentRegistry: CustomElementComponentRegistry,
  ) {}

  ngOnInit(): void {
    this.filepath$ = this.route.url.pipe(map((url) => url.join('/')));

    this.currentHeaderId$ = this.customElementComponentRegistry.update$.pipe(
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

    this.currentHeaderId$
      .pipe(takeUntil(this.destroy), filter(Boolean))
      .subscribe((id) => {
        this.history.replaceState(null, '', `${this.location.pathname}#${id}`);
      });

    this.ready.pipe(skip(1)).subscribe(() => {
      this.document.documentElement.scrollTop = 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
