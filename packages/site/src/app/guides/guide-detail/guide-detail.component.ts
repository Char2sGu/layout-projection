import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
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
      debounceTime(0),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
