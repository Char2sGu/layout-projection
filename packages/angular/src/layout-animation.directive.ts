import { Directive, Input, OnInit, Self } from '@angular/core';
import {
  LayoutAnimator,
  Node,
  NodeSnapper,
  NodeSnapshotMap,
} from '@layout-projection/core';
import {
  animationFrames,
  BehaviorSubject,
  EMPTY,
  exhaustAll,
  first,
  Observable,
  of,
  skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { LayoutAnimationConfigDirective } from './layout-animation-config.directive';

@Directive({
  selector: '[lpjNode][lpjAnimation],[lpjNode][animateOn]',
})
export class LayoutAnimationDirective implements OnInit {
  /**
   * Accepts:
   * - A stream that informs on view model updates where DOM updates that should
   * be animated will follow.
   * - An arbitrary value which will be set to another value before DOM updates.
   *
   * Note: If using an arbitrary value, layout changes of the host element will
   * not be animated because Angular updates the input binding after the DOM and
   * we are unable to snapshot the original layout.
   */
  @Input() set animateOn(value: unknown) {
    const stream =
      value instanceof Observable
        ? value.pipe(startWith(of(value)))
        : of(value);
    this.animateOn$.next(stream);
  }
  private animateOn$ = new BehaviorSubject<Observable<void>>(EMPTY);

  animationConfigs = new Set<LayoutAnimationConfigDirective>();

  private snapshots = new NodeSnapshotMap();

  constructor(
    @Self() private node: Node,
    private animator: LayoutAnimator,
    private snapper: NodeSnapper,
  ) {}

  ngOnInit(): void {
    this.animateOn$
      .pipe(
        exhaustAll(),
        skip(1),
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
        tap(() => this.animate()),
      )
      .subscribe();
  }

  snapshot(): void {
    this.snapper.snapshotFrom(this.node, this.snapshots);
  }

  async animate(): Promise<void> {
    if (!this.snapshots) throw new Error('Missing snapshots');
    const configs = [...this.animationConfigs];
    await Promise.all(
      configs.map((config) => {
        this.animator.animate({
          root: config.node,
          from: this.snapshots,
          duration: config.animationDuration,
          easing: config.animationEasing,
        });
      }),
    );
  }
}
