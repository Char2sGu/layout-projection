import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  InjectionToken,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';
import { filter, map, shareReplay, startWith, tap } from 'rxjs';

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
  itemActive: Signal<NavItem | undefined>;
  itemLastHovered?: NavItem;
  animationEntry = inject(LayoutAnimationEntry);

  private router = inject(Router);

  constructor() {
    this.itemActive = toSignal<NavItem | undefined>(
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.matchActiveItemByRoute() ?? undefined),
        tap(() => this.initiateLayoutAnimation()),
        startWith(this.matchActiveItemByRoute() ?? undefined),
        shareReplay(1),
      ),
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

  matchActiveItemByRoute(): NavItem | null {
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
    return null;
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
