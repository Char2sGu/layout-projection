import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WINDOW } from '@ng-web-apis/common';
import { BehaviorSubject, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'lpj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('header', [
      state('detached', style({ boxShadow: 'var(--lpj-elevation)' })),
      state('regular', style({})),
      transition('regular <=> detached', [animate(`200ms linear`)]),
    ]),
  ],
})
export class AppComponent {
  documentScrollTop$ = new BehaviorSubject(0);

  headerDetached$ = this.documentScrollTop$.pipe(
    map((scrollTop) => scrollTop > 10),
    distinctUntilChanged(),
  );

  constructor() {
    const window = inject(WINDOW);
    const documentElement = inject(DOCUMENT).documentElement;

    fromEvent(window, 'scroll')
      .pipe(
        takeUntilDestroyed(),
        map(() => documentElement.scrollTop),
      )
      .subscribe(this.documentScrollTop$);
  }
}
