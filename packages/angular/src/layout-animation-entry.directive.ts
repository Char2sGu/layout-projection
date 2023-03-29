import { Directive, Host, Input, Optional, Self } from '@angular/core';
import {
  LayoutAnimationConfig,
  LayoutAnimator,
  Node,
  NodeSnapper,
  NodeSnapshotMap,
} from '@layout-projection/core';

import { LayoutAnimationScopeNodeRegistry } from './layout-animation-scope.directive';

@Directive({
  selector: '[lpjNode][lpjAnimation]',
  exportAs: 'lpjAnimation',
})
export class LayoutAnimationEntryDirective {
  @Input() set lpjAnimation(v: '' | this['config']) {
    if (typeof v === 'string') return;
    this.config = v;
  }

  config: Pick<LayoutAnimationConfig, 'duration' | 'easing'> = {};
  snapshots = new NodeSnapshotMap();

  constructor(
    @Self() public node: Node,
    private animator: LayoutAnimator,
    private snapper: NodeSnapper,
    @Host() @Optional() private nodeRegistry?: LayoutAnimationScopeNodeRegistry,
  ) {}

  snapshot(): void {
    this.snapshots.clear();
    const filter = this.nodeRegistry?.has.bind(this.nodeRegistry);
    this.snapper.snapshotTree(this.node, this.snapshots, filter);
  }

  async animate(): Promise<void> {
    if (!this.snapshots) throw new Error('Missing snapshots');
    const { duration, easing } = this.config;
    await this.animator.animate({
      root: this.node,
      from: this.snapshots,
      duration,
      easing,
    });
  }
}
