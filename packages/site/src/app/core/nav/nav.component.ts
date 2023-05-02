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
  items: NavItem[] = [
    { name: 'Overview' },
    { name: 'Layout Projection' },
    { name: 'Layout Animation' },
    {
      name: 'Developer Guides',
      children: [{ name: 'Snapshot APIs' }, { name: 'Standalone Usage' }],
    },
    {
      name: 'Adapter / Angular',
      children: [
        { name: 'Overview' },
        { name: 'Projection Tree' },
        { name: 'Animation Directives' },
        { name: 'Animation Scope' },
      ],
    },
  ];
  itemActive = this.items[0];
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

interface NavItem {
  name: string;
  children?: NavItem[];
}
