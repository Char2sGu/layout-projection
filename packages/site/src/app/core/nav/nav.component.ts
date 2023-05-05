import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  InjectionToken,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';
import { filter, map, Observable, tap } from 'rxjs';

import { AnimationCurve } from '../../common/animation';

export const NAV_CONTENT = new InjectionToken<NavItemGroup[]>('NAV_CONTENT');

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective, LayoutAnimationEntryDirective],
  animations: [
    trigger('overlay', [
      transition('void => initial', [style({ opacity: 0 }), animate(125)]),
    ]),
  ],
})
export class NavComponent {
  itemGroups: NavItemGroup[] = inject(NAV_CONTENT);
  itemActive$: Observable<NavItem>;
  itemLastHovered?: NavItem;
  animationEntry = inject(LayoutAnimationEntry);

  private router = inject(Router);

  constructor() {
    this.itemActive$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.matchActiveItemByRoute()),
      tap(() => this.initiateLayoutAnimation()),
    );
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.animationEntry.snapshots.clear();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.itemLastHovered = undefined;
  }

  onItemMouseEnter(item: NavItem): void {
    if (this.itemLastHovered === item) return;
    this.itemLastHovered = item;
    this.initiateLayoutAnimation();
  }

  initiateLayoutAnimation(): void {
    this.animationEntry.snapshot();
    requestAnimationFrame(() => {
      this.animationEntry.animate({
        duration: 125,
        easing: AnimationCurve.Emphasized,
      });
    });
  }

  matchActiveItemByRoute(): NavItem {
    for (const group of this.itemGroups) {
      const item = group.items.find((item) =>
        this.router.isActive(item.path, {
          paths: 'exact',
          fragment: 'ignored',
          matrixParams: 'ignored',
          queryParams: 'ignored',
        }),
      );
      if (item) return item;
    }
    throw new Error('No active nav item matched');
  }
}

export interface NavItemGroup {
  name: string;
  items: NavItem[];
}

export interface NavItem {
  name: string;
  path: string;
}
