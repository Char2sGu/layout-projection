import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

import { GUIDES_PAGES } from '../guides.pages';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent implements OnInit {
  title$!: Observable<string>;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.title$ = this.route.params.pipe(
      map(() =>
        GUIDES_PAGES.find((page) =>
          this.router.isActive(page.route, {
            paths: 'exact',
            fragment: 'ignored',
            matrixParams: 'ignored',
            queryParams: 'ignored',
          }),
        ),
      ),
      filter(Boolean),
      map((page) => page.title),
    );
  }
}
