import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
} from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { NavItem, NavItemGroup } from '../nav.models';
import { NavContentActivationDetector } from '../nav-content-activation-detector.service';

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
  private activationDetector = inject(NavContentActivationDetector);

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

  itemActive$: Observable<NavItem | undefined> = merge(
    this.itemGroups$,
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
  ).pipe(
    map(() => this.detectActiveItem()),
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

    // Magic workaround for the second takeUntilDestroyed() to work
    // TODO: remove when fixed
    inject(DestroyRef).onDestroy(() => {});

    merge(
      this.itemActive$.pipe(filter(Boolean)),
      this.itemLastHovered$.pipe(filter(Boolean)),
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.initiateLayoutAnimation());
  }

  initiateLayoutAnimation(): void {
    this.animationEntry.snapshot({ measure: true });
    requestAnimationFrame(() => {
      this.animationEntry.animate({
        duration: 125,
        easing: AnimationCurve.Standard,
      });
    });
  }

  detectActiveItem(): NavItem | undefined {
    return this.activationDetector.detect()?.item;
  }
}
