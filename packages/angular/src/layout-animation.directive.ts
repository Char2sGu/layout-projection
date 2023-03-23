import {
  Directive,
  Host,
  Input,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import {
  LayoutAnimationConfig,
  LayoutAnimator,
  Node,
  NodeSnapper,
  NodeSnapshotMap,
} from '@layout-projection/core';

@Directive({
  selector: '[lpjNode][lpjAnimation]',
  exportAs: 'lpjAnimation',
})
export class LayoutAnimationDirective implements OnDestroy {
  @Input() animationDuration: LayoutAnimationConfig['duration'] = 225;
  @Input() animationEasing: LayoutAnimationConfig['easing'] = 'ease-in-out';

  constructor(
    @Self() public node: Node,
    private animator: LayoutAnimator,
    private snapper: NodeSnapper,
    @Host() private snapshots: NodeSnapshotMap,
    @Host() @Optional() private registry?: LayoutAnimationDirectiveRegistry,
  ) {
    this.registry?.add(this);
  }

  ngOnDestroy(): void {
    this.registry?.delete(this);
  }

  snapshot(): void {
    this.snapper.snapshotFrom(this.node, this.snapshots);
  }

  async animate(): Promise<void> {
    if (!this.snapshots) throw new Error('Missing snapshots');
    await this.animator.animate({
      root: this.node,
      from: this.snapshots,
      duration: this.animationDuration,
      easing: this.animationEasing,
    });
  }
}

export class LayoutAnimationDirectiveRegistry extends Set<LayoutAnimationDirective> {}
