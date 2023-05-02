import {
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  AggregationAnimationRef,
  AnimationRef,
  LayoutAnimationEntry,
  ProjectionNode,
} from '@layout-projection/core';
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

import { LayoutAnimationScopeEntryRegistry } from './layout-animation-scope.providers';

@Directive({
  selector: '[lpjAnimationTrigger]',
  standalone: true,
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
    this.targets = Array.isArray(value) ? value : [value];
  }
  private targets: LayoutAnimationTriggerTargetInput[] = [];

  @Output() animationTrigger = new EventEmitter();
  @Output() animationSettle = new EventEmitter();

  constructor(
    @Optional() private entryRegistry?: LayoutAnimationScopeEntryRegistry,
  ) {}

  ngOnInit(): void {
    this.trigger$
      .pipe(
        exhaustAll(),
        skip(1),
        tap(() => this.animationTrigger.emit()),
        tap(() => this.snapshot()),
        switchMap(() => animationFrames().pipe(first())),
        map(() => this.animate()),
        tap((ref) => ref.then(() => this.animationSettle.emit())),
      )
      .subscribe();
  }

  snapshot(): void {
    this.resolveTargets().forEach((entry) => entry.snapshot());
  }

  animate(): AnimationRef {
    const animations = this.resolveTargets().map((entry) => entry.animate());
    return new AggregationAnimationRef(animations);
  }

  resolveTargets(): LayoutAnimationEntry[] {
    return this.targets.map((target) => this.resolveTarget(target));
  }

  resolveTarget(
    target: LayoutAnimationTriggerTargetInput,
  ): LayoutAnimationEntry {
    if (target instanceof LayoutAnimationEntry) return target;

    if (!this.entryRegistry) this.resolveFailed(target, 'no context provided');
    const entries = Array.from(this.entryRegistry);

    const id = target instanceof ProjectionNode ? target.id : target;
    const result = entries.find((e) => e.node.id === id);
    if (!result) this.resolveFailed(target, 'not found');
    return result;
  }

  private resolveFailed(
    target: LayoutAnimationTriggerTargetInput,
    detail: string,
  ): never {
    throw new Error(`Failed to resolve target ${target}: ${detail}`);
  }
}

export type LayoutAnimationTriggerTargetInput =
  | ProjectionNode
  | ProjectionNode['id']
  | LayoutAnimationEntry;
