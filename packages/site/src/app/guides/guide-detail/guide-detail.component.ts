import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap, takeUntil } from 'rxjs';

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
    private customElementComponentRegistry: CustomElementComponentRegistry,
  ) {}

  ngOnInit(): void {
    this.filename$ = this.route.params.pipe(
      map((params) => params['filename']),
    );

    this.currentHeaderId$ = this.customElementComponentRegistry.update$.pipe(
      takeUntil(this.destroy),
      map(() => this.customElementComponentRegistry),
      map((set) =>
        [...set]
          .filter((c): c is HeadingComponent => c instanceof HeadingComponent)
          .map((c) => c.visibility$.pipe(map((v) => ({ id: c.id, v })))),
      ),
      switchMap((entries) => combineLatest(entries)),
      map((visibilities) => visibilities.find(({ v }) => v)?.id),
    );

    // TODO: update url hash
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }
}
