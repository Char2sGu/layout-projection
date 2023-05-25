import { Directive, Input, Optional, Self } from '@angular/core';
import {
  LayoutAnimationEntry,
  LayoutAnimationEntryAnimationConfig,
  LayoutAnimator,
  ProjectionNode,
  ProjectionNodeSnapper,
  ProjectionNodeSnapshotMap,
  ProjectionTreeSnapshotOptions,
} from '@layout-projection/core';

import { LayoutAnimationScopeNodeRegistry } from './layout-animation-scope.providers';

@Directive({
  selector: '[lpjNode][lpjAnimation]',
  exportAs: 'lpjAnimation',
  standalone: true,
  providers: [
    {
      provide: LayoutAnimationEntry,
      useExisting: LayoutAnimationEntryDirective,
    },
  ],
})
export class LayoutAnimationEntryDirective extends LayoutAnimationEntry {
  @Input() set lpjAnimation(v: '' | this['animationConfig']) {
    if (typeof v === 'string') return;
    this.animationConfig = v;
  }

  // make public
  override animationConfig: LayoutAnimationEntryAnimationConfig = {};

  constructor(
    @Self() node: ProjectionNode,
    animator: LayoutAnimator,
    snapper: ProjectionNodeSnapper,
    @Optional() snapshots?: ProjectionNodeSnapshotMap,
    @Optional() private nodeRegistry?: LayoutAnimationScopeNodeRegistry,
  ) {
    super({ node, deps: [animator, snapper], storage: snapshots });
  }

  override snapshot(options?: ProjectionTreeSnapshotOptions): void {
    if (this.nodeRegistry && options?.filter) {
      const filter = options.filter;
      const registry = this.nodeRegistry;
      options.filter = (node) => registry.has(node) && filter(node);
    }
    const snapshots = this.snapper.snapshotTree(this.node, options);
    this.snapshots.merge(snapshots);
  }
}
