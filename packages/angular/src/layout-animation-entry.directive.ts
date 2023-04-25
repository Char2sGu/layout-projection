import { Directive, Input, Optional, Self } from '@angular/core';
import {
  AnimationRef,
  LayoutAnimationEntry,
  LayoutAnimationEntryConfig,
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
export class LayoutAnimationEntryDirective extends LayoutAnimationEntry {
  @Input() set lpjAnimation(v: '' | this['config']) {
    if (typeof v === 'string') return;
    this.config = v;
  }

  config: LayoutAnimationEntryConfig = {};

  constructor(
    @Self() node: ProjectionNode,
    animator: LayoutAnimator,
    snapper: ProjectionNodeSnapper,
    snapshots: ProjectionNodeSnapshotMap,
    @Optional() private nodeRegistry?: LayoutAnimationScopeNodeRegistry,
  ) {
    super(node, animator, snapper, snapshots);
  }

  override snapshot(): void {
    const filter = this.nodeRegistry?.has.bind(this.nodeRegistry);
    const snapshots = this.snapper.snapshotTree(this.node, filter);
    this.snapshots.merge(snapshots);
  }

  override animate(): AnimationRef {
    return super.animate(this.config);
  }
}
