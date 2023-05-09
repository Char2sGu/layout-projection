import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  Input,
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
import { NavItem, NavItemGroup } from '../nav.models';

@Component({
  selector: 'lpj-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective, LayoutAnimationEntryDirective],
  animations: [
    trigger('overlay', [
      transition('void => initial', [style({ opacity: 0 }), animate(125)]),
    ]),
  ],
})
export class NavMenuComponent {
  @Input({ alias: 'content', required: true })
  itemGroups: NavItemGroup[] = [];
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
