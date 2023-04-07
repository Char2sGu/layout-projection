import { Directive, Host, Input, OnInit } from '@angular/core';
import { ProjectionNode } from '@layout-projection/core';
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

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { LayoutAnimationScopeEntryRegistry } from './layout-animation-scope.directive';

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

  @Input() set lpjAnimationTriggerFor(
    value:
      | LayoutAnimationTriggerTargetInput
      | LayoutAnimationTriggerTargetInput[],
  ) {
    const normalize = (input: LayoutAnimationTriggerTargetInput) =>
      input instanceof ProjectionNode ? input.id : input;
    this.targetIds =
      value instanceof Array ? value.map(normalize) : [normalize(value)];
  }
  private targetIds: string[] = [];

  constructor(
    @Host() private entryRegistry: LayoutAnimationScopeEntryRegistry,
  ) {}

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
    this.findTargets().forEach((entry) => entry.snapshot());
  }

  animate(): void {
    this.findTargets().forEach((entry) => entry.animate());
  }

  findTargets(): LayoutAnimationEntryDirective[] {
    const targets = Array.from(this.entryRegistry).filter((directive) =>
      this.targetIds.includes(directive.node.id),
    );
    if (!targets.length) throw new Error(`Failed to find any target entry`);
    return targets;
  }
}

export type LayoutAnimationTriggerTargetInput = ProjectionNode | string;
