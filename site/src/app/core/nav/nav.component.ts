import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, first, map } from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { NAV_CONTENT } from '../nav.models';
import { NavContentActivationDetector } from '../nav-content-activation-detector.service';

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('navMenu', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          `210ms 90ms ${AnimationCurve.Deceleration}`,
          style({ opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(`300ms ${AnimationCurve.Acceleration}`, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class NavComponent {
  private content = inject(NAV_CONTENT);
  private contentActivationDetector = inject(NavContentActivationDetector);
  private router = inject(Router);

  tabs = Object.keys(this.content);
  tabActive$ = new BehaviorSubject(this.tabs[0]);

  items$ = this.tabActive$.pipe(map((tab) => this.content[tab]));

  constructor() {
    this.router.events
      .pipe(first((e) => e instanceof NavigationEnd))
      .subscribe(() => this.activateRouteTab());
  }

  activateRouteTab(): void {
    const tab = this.contentActivationDetector.detect()?.tab;
    if (tab) this.tabActive$.next(tab);
  }
}
