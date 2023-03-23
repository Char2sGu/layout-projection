import { Directive, Input, OnInit } from '@angular/core';
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

import {
  LayoutAnimationDirective,
  LayoutAnimationDirectiveRegistry,
} from './layout-animation.directive';

@Directive({
  selector: '[lpjAnimationTrigger]',
})
export class LayoutAnimationTriggerDirective implements OnInit {
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
  @Input() set lpjAnimationTrigger(value: unknown) {
    const stream =
      value instanceof Observable
        ? value.pipe(startWith(of(value)))
        : of(value);
    this.trigger$.next(stream);
  }
  private trigger$ = new BehaviorSubject<Observable<void>>(EMPTY);

  @Input() set lpjAnimationTriggerFor(value: string | string[]) {
    this.targetIds = value instanceof Array ? value : [value];
  }
  private targetIds: string[] = [];

  constructor(private registry: LayoutAnimationDirectiveRegistry) {}

  ngOnInit(): void {
    this.trigger$
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
    this.findTargets().forEach((directive) => directive.snapshot());
  }

  animate(): void {
    this.findTargets().forEach((directive) => directive.animate());
  }

  findTargets(): LayoutAnimationDirective[] {
    return Array.from(this.registry).filter((directive) =>
      this.targetIds.includes(directive.node.id),
    );
  }
}
