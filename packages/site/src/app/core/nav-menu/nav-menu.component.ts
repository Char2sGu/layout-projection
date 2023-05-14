import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  mergeWith,
  Observable,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

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
  animationEntry = inject(LayoutAnimationEntry);
  private router = inject(Router);

  // prettier-ignore
  @Input({ alias: 'content', required: true })
  set itemGroupsInput(v: NavItemGroup[]) { this.itemGroups$.next(v) }
  itemGroups$ = new BehaviorSubject<NavItemGroup[]>([]);
  itemGroups = toSignal(this.itemGroups$, { initialValue: [] });

  // prettier-ignore
  @HostListener('mouseenter')
  mouseEnterInput(): void { this.mouseEnter.emit() }
  mouseEnter = new EventEmitter();

  // prettier-ignore
  @HostListener('mouseleave')
  mouseLeaveInput(): void { this.mouseLeave.emit() }
  mouseLeave = new EventEmitter();

  itemMouseEnter = new EventEmitter<NavItem>();

  itemActive$: Observable<NavItem | undefined> = this.itemGroups$.pipe(
    filter((groups) => !!groups.length),
    switchMap((groups) =>
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => groups),
        startWith(groups),
      ),
    ),
    map((groups) => this.matchActiveItemByRoute(groups) ?? undefined),
    shareReplay(1),
  );
  itemActive = toSignal(this.itemActive$);

  itemLastHovered$ = this.itemMouseEnter.pipe(
    mergeWith(this.mouseLeave.pipe(map(() => undefined))),
    shareReplay(1),
  );
  itemLastHovered = toSignal(this.itemLastHovered$);

  constructor() {
    this.mouseEnter
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.animationEntry.snapshots.clear());

    merge(
      this.itemActive$.pipe(filter(Boolean)),
      this.itemLastHovered$.pipe(filter(Boolean)),
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.initiateLayoutAnimation());
  }

  initiateLayoutAnimation(): void {
    this.animationEntry.snapshot();
    requestAnimationFrame(() => {
      this.animationEntry.animate({
        duration: 125,
        easing: AnimationCurve.Standard,
      });
    });
  }

  matchActiveItemByRoute(groups: NavItemGroup[]): NavItem | null {
    for (const group of groups) {
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
