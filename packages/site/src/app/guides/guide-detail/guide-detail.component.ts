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
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent implements OnInit, OnDestroy {
  filepath$!: Observable<string>;

  protected destroy = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.filepath$ = this.route.url.pipe(map((url) => url.join('/')));
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }

  resetScroll(): void {
    this.document.documentElement.scrollTop = 0;
  }
}
