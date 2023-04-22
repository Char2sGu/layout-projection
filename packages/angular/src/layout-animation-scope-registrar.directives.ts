import { Directive, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ProjectionNode } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import {
  LayoutAnimationScopeEntryRegistry,
  LayoutAnimationScopeNodeRegistry,
  ProjectionNodeSnapshotMapExpirer,
} from './layout-animation-scope.providers';

@Directive({
  selector: '[lpjNode]',
})
export class LayoutAnimationScopeNodeRegistrarDirective
  implements OnInit, OnDestroy
{
  constructor(
    @Self() private node: ProjectionNode,
    @Optional() private registry?: LayoutAnimationScopeNodeRegistry,
    @Optional() private snapshots?: ProjectionNodeSnapshotMapExpirer,
  ) {}
  ngOnInit(): void {
    this.registry?.add(this.node);
    this.snapshots?.refresh(this.node.id);
  }
  ngOnDestroy(): void {
    this.registry?.delete(this.node);
    this.snapshots?.stale(this.node.id);
  }
}

@Directive({
  selector: '[lpjAnimation]',
})
export class LayoutAnimationScopeEntryRegistrarDirective
  implements OnInit, OnDestroy
{
  constructor(
    @Self() private entry: LayoutAnimationEntryDirective,
    @Optional() private registry?: LayoutAnimationScopeEntryRegistry,
  ) {}
  ngOnInit(): void {
    this.registry?.add(this.entry);
  }
  ngOnDestroy(): void {
    this.registry?.delete(this.entry);
  }
}
