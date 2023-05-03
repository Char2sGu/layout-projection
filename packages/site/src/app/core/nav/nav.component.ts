import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';

import { AnimationCurve } from '../../common/animation';

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective, LayoutAnimationEntryDirective],
})
export class NavComponent {
  itemGroups: NavItemGroup[] = [
    {
      name: 'Getting Started',
      items: [
        { name: 'Overview' },
        { name: 'Layout Projection' },
        { name: 'Layout Animation' },
      ],
    },
    {
      name: 'Developer Guides',
      items: [{ name: 'Snapshot APIs' }, { name: 'Standalone Usage' }],
    },
    {
      name: 'Adapter / Angular',
      items: [
        { name: 'Overview' },
        { name: 'Projection Tree' },
        { name: 'Animation Directives' },
        { name: 'Animation Scope' },
      ],
    },
  ];
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

interface NavItemGroup {
  name: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
}
