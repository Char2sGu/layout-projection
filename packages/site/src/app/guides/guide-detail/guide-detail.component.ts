import { DOCUMENT, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent {
  filepath$: Observable<string>;

  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private scroller = inject(ViewportScroller);

  constructor() {
    this.filepath$ = this.route.url.pipe(map((url) => url.join('/')));
    this.route.fragment.pipe(filter(Boolean)).subscribe((fragment) => {
      this.scroller.scrollToAnchor(fragment);
    });
  }

  resetScroll(): void {
    this.document.documentElement.scrollTop = 0;
  }
}
