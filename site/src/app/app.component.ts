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
import {
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  pairwise,
} from 'rxjs';

@Component({
  selector: 'lpj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('header', [
      state('regular', style({})),
      state('detached', style({ boxShadow: 'var(--lpj-elevation)' })),
      state('collapsed', style({ transform: 'translateY(-100%)' })),
      transition('regular <=> detached', [animate(`200ms linear`)]),
      transition('collapsed <=> detached', [animate(`200ms ease-in-out`)]),
    ]),
  ],
})
export class AppComponent {
  documentScrollTop$ = new BehaviorSubject(0);

  headerState$: Observable<string> = this.documentScrollTop$.pipe(
    pairwise(),
    map(([prev, curr]) => {
      if (curr > 50 && curr > prev) return 'collapsed';
      if (curr > 10) return 'detached';
      return 'regular';
    }),
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
