import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lpj-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailComponent implements OnInit {
  filename$!: Observable<string>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.filename$ = this.route.params.pipe(
      map((params) => params['filename']),
    );
  }
}
