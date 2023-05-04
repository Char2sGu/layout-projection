import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  InjectionToken,
} from '@angular/core';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';

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
  itemActive?: NavItem;
  itemLastHovered?: NavItem;
  entry = inject(LayoutAnimationEntry);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.entry.snapshots.clear();
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

  onItemClick(item: NavItem): void {
    if (this.itemActive === item) return;
    this.itemActive = item;
    this.initiateLayoutAnimation();
  }

  initiateLayoutAnimation(): void {
    this.entry.snapshot();
    requestAnimationFrame(() => {
      this.entry.animate({
        duration: 125,
        easing: AnimationCurve.Emphasized,
      });
    });
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
