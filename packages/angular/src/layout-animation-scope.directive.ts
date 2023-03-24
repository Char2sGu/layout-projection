import { Directive, inject } from '@angular/core';
import { Node, NodeSnapshot, NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';

export class LayoutAnimationScopeNodeRegistry extends Set<Node> {
  private idSet = new Set<string>();
  override add(value: Node): this {
    this.idSet.add(value.id);
    return super.add(value);
  }
  override delete(value: Node): boolean {
    this.idSet.delete(value.id);
    return super.delete(value);
  }
  override clear(): void {
    this.idSet.clear();
    super.clear();
  }
  hasId(id: string): boolean {
    return this.idSet.has(id);
  }
}

export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}

export class LayoutAnimationScopedNodeSnapshotMap extends NodeSnapshotMap {
  constructor(private nodeRegistry: LayoutAnimationScopeNodeRegistry) {
    super();
  }
  override set(key: string, value: NodeSnapshot): this {
    if (!this.nodeRegistry.hasId(key)) return this;
    return super.set(key, value);
  }
}

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: LayoutAnimationScopeNodeRegistry,
      useValue: new LayoutAnimationScopeNodeRegistry(),
    },
    {
      provide: LayoutAnimationScopeEntryRegistry,
      useValue: new LayoutAnimationScopeEntryRegistry(),
    },
    {
      provide: NodeSnapshotMap,
      useFactory: () =>
        new LayoutAnimationScopedNodeSnapshotMap(
          inject(LayoutAnimationScopeNodeRegistry),
        ),
    },
  ],
})
export class LayoutAnimationScopeDirective {}
