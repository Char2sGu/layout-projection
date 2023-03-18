import { Directive, Input, OnInit, Self } from '@angular/core';
import {
  LayoutAnimationEasingParser,
  LayoutAnimator,
  LayoutMeasurer,
  LayoutProjectionNode,
} from '@layout-projection/core';
import { Easing } from 'popmotion';
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

@Directive({
  selector: '[lpjNode][lpjAnimation],[lpjNode][animateOn]',
  providers: [
    { provide: LayoutAnimator, useExisting: LayoutAnimationDirective },
  ],
})
export class LayoutAnimationDirective extends LayoutAnimator implements OnInit {
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
    @Self() node: LayoutProjectionNode,
    measurer: LayoutMeasurer,
    easingParser: LayoutAnimationEasingParser,
  ) {
    super(node, measurer, easingParser);
  }

  ngOnInit(): void {
    this.animateOn$
      .pipe(
        exhaustAll(),
        skip(1),
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
      )
      .subscribe(() => this.animate());
  }

  override async animate(
    duration: number = this.animationDuration,
    easing: string | Easing = this.animationEasing,
  ): Promise<void> {
    return super.animate(duration, easing);
  }
}
