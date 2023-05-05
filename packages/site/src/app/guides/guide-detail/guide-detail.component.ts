import { DOCUMENT, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  mergeWith,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

import { VisibilityObserver } from '../../core/visibility-observer.service';
import {
  HeadingComponent,
  HeadingNgElement,
} from '../../markdown-elements/heading/heading.component';
import { NgElementQuerier } from '../../markdown-elements/shared/ng-element';
import { MarkdownArticleComponent } from '../../shared/markdown-article/markdown-article.component';
import { GuideRecord } from '../shared/guide.models';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent {
  @Input() record!: GuideRecord;

  // prettier-ignore
  @ViewChild(MarkdownArticleComponent, { read: ElementRef })
  set contentElementInput(elementRef: ElementRef<HTMLElement>) { this.contentElement$.next(elementRef.nativeElement) }
  contentElement$ = new BehaviorSubject<HTMLElement | null>(null);

  headings$: Observable<HeadingNgElement[]>;
  headingActive$: Observable<HeadingNgElement>;

  render = new EventEmitter();

  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private scroller = inject(ViewportScroller);
  private querier = inject(NgElementQuerier);
  private visibilityObserver = inject(VisibilityObserver);

  constructor() {
    this.headings$ = this.contentElement$.pipe(
      mergeWith(this.render.pipe(map(() => this.contentElement$.value))),
      filter(Boolean),
      map((element) => this.querier.queryAll(element, HeadingComponent)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.headingActive$ = this.headings$.pipe(
      map((arr) =>
        arr.map((ele) =>
          this.visibilityObserver
            .observe(ele)
            .pipe(map((visible) => ({ ele, visible }))),
        ),
      ),
      switchMap((observables) => combineLatest(observables)),
      map((entries) => entries.find(({ visible }) => visible)?.ele),
      filter(Boolean),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.headings$.subscribe(() => {
      this.scroller.scrollToPosition([0, 0]);
    });

    this.route.fragment.pipe(filter(Boolean)).subscribe((fragment) => {
      this.scroller.scrollToAnchor(fragment);
    });
  }

  resetScroll(): void {
    this.document.documentElement.scrollTop = 0;
  }
}
