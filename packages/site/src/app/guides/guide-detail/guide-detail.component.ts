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
import { map, Observable, skip } from 'rxjs';

import { MarkdownCurrentHeadingTrackerDirective } from '../../shared/markdown-current-heading-tracker.directive';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MarkdownCurrentHeadingTrackerDirective],
})
export class GuideDetailComponent implements OnInit, OnDestroy {
  filepath$!: Observable<string>;
  ready = new EventEmitter();

  protected destroy = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.filepath$ = this.route.url.pipe(map((url) => url.join('/')));

    this.ready.pipe(skip(1)).subscribe(() => {
      this.document.documentElement.scrollTop = 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
