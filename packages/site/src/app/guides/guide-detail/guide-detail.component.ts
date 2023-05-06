import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

import { UrlFragmentReplacer } from '../../core/url-fragment-replacer.service';
import { VisibilityObserver } from '../../core/visibility-observer.service';
import {
  HeadingComponent,
  HeadingNgElement,
} from '../../markdown-elements/heading/heading.component';
import { NgElementQuerier } from '../../markdown-elements/shared/ng-element';
import { FixLayoutOnDestroyDirective } from '../../shared/fix-layout-on-destroy.directive';
import { MarkdownArticleComponent } from '../../shared/markdown-article/markdown-article.component';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [FixLayoutOnDestroyDirective],
})
export class GuideDetailComponent {
  @Input() content!: string;

  @ViewChild(MarkdownArticleComponent, { read: ElementRef })
  contentElementRef!: ElementRef<HTMLElement>;

  headings$: Observable<HeadingNgElement[]>;
  headingActive$: Observable<HeadingNgElement>;

  render = new EventEmitter();

  private querier = inject(NgElementQuerier);
  private visibilityObserver = inject(VisibilityObserver);
  private fragmentReplacer = inject(UrlFragmentReplacer);

  constructor() {
    this.headings$ = this.render.pipe(
      map(() => this.contentElementRef.nativeElement),
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
      distinctUntilChanged((a, b) => a.id === b.id),
      debounceTime(200),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.headingActive$.pipe(takeUntilDestroyed()).subscribe((heading) => {
      this.fragmentReplacer.replaceWith(heading.id);
    });
  }
}
