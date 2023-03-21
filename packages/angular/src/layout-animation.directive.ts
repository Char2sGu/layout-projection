import { Directive, Input, OnInit, Self } from '@angular/core';
import { LayoutAnimator, Node, NodeSnapper } from '@layout-projection/core';
import { Easing } from 'popmotion';
import {
  animationFrames,
  BehaviorSubject,
  EMPTY,
  exhaustAll,
  first,
  map,
  Observable,
  of,
  skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

@Directive({
  selector: '[lpjNode][lpjAnimation],[lpjNode][animateOn]',
})
export class LayoutAnimationDirective implements OnInit {
  /**
   * Accepts:
   * - A stream that informs on view model updates where DOM updates that should
   * be animated will follow.
   * - An arbitrary value which will be set to another value before DOM updates.
   */
  @Input() set animateOn(value: unknown) {
    const stream =
      value instanceof Observable
        ? value.pipe(startWith(of(value)))
        : of(value);
    this.animateOn$.next(stream);
  }
  private animateOn$ = new BehaviorSubject<Observable<void>>(EMPTY);

  @Input() animationDuration: number = 225;
  @Input() animationEasing: string | Easing = 'ease-in-out';

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
        map(() => this.snapper.snapshotTree(this.node)),
        switchMap((snapshots) =>
          animationFrames().pipe(
            first(),
            map(() => snapshots),
          ),
        ),
        tap((snapshots) =>
          this.animator.animate({
            root: this.node,
            from: snapshots,
            duration: this.animationDuration,
            easing: this.animationEasing,
          }),
        ),
      )
      .subscribe();
  }
}
