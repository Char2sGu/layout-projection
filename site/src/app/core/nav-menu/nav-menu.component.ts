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
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  mergeWith,
  Observable,
  shareReplay,
} from 'rxjs';

import { NavItem, NavItemGroup } from '../nav.models';
import { NavContentActivationDetector } from '../nav-content-activation-detector.service';

@Component({
  selector: 'lpj-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: LayoutNode },
    { directive: LayoutNodeAnimator, inputs: ['duration', 'easing'] },
  ],
  animations: [
    trigger('overlay', [
      transition('void => initial', [style({ opacity: 0 }), animate(125)]),
    ]),
  ],
})
export class NavMenuComponent {
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
    // Magic workaround for the second takeUntilDestroyed() to work
    // TODO: remove when fixed
    inject(DestroyRef).onDestroy(() => {});
  }

  detectActiveItem(): NavItem | undefined {
    return this.activationDetector.detect()?.item;
  }
}
