import { Injectable } from '@angular/core';
import {
  LayoutAnimationEntry,
  ProjectionNode,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';

import { MapExpirer } from './shared/map';

export class LayoutAnimationScopeNodeRegistry extends Set<ProjectionNode> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntry> {}

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
