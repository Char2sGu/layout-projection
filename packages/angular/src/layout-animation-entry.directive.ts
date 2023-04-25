import { Directive, Input, Optional, Self } from '@angular/core';
import {
  AnimationRef,
  LayoutAnimationConfig,
  LayoutAnimator,
  ProjectionNode,
  ProjectionNodeSnapper,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';

import { LayoutAnimationScopeNodeRegistry } from './layout-animation-scope.providers';

@Directive({
  selector: '[lpjNode][lpjAnimation]',
  exportAs: 'lpjAnimation',
  standalone: true,
})
export class LayoutAnimationEntryDirective {
  @Input() set lpjAnimation(v: '' | this['config']) {
    if (typeof v === 'string') return;
    this.config = v;
  }

  config: Omit<LayoutAnimationConfig, 'root' | 'from'> = {};

  constructor(
    @Self() public node: ProjectionNode,
    private animator: LayoutAnimator,
    private snapper: ProjectionNodeSnapper,
    private snapshots: ProjectionNodeSnapshotMap,
    @Optional() private nodeRegistry?: LayoutAnimationScopeNodeRegistry,
  ) {}

  snapshot(): void {
    const filter = this.nodeRegistry?.has.bind(this.nodeRegistry);
    const snapshots = this.snapper.snapshotTree(this.node, filter);
    this.snapshots.merge(snapshots);
  }

  animate(): AnimationRef {
    if (!this.snapshots) throw new Error('Missing snapshots');
    return this.animator.animate({
      root: this.node,
      from: this.snapshots,
      ...this.config,
    });
  }
}
