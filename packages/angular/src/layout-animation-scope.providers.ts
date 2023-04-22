import { Injectable } from '@angular/core';
import {
  ProjectionNode,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { MapExpirer } from './shared/map';

export class LayoutAnimationScopeNodeRegistry extends Set<ProjectionNode> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}

@Injectable()
export class LayoutAnimationScopeRef {
  constructor(
    readonly nodeRegistry: LayoutAnimationScopeNodeRegistry,
    readonly entryRegistry: LayoutAnimationScopeEntryRegistry,
    readonly snapshots: ProjectionNodeSnapshotMap,
  ) {}
}

@Injectable()
export class ProjectionNodeSnapshotMapExpirer extends MapExpirer<
  ProjectionNode['id']
> {
  constructor(map: ProjectionNodeSnapshotMap) {
    super(map, 10);
  }
}
