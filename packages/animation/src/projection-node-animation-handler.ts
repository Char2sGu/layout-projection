import { ProjectionNode } from '@layout-projection/core';

import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

export interface ProjectionNodeAnimationFrameContext {
  node: ProjectionNode;
  from: ProjectionNodeSnapshot;
  to: ProjectionNodeSnapshot;
  progress: number;
}

export interface ProjectionNodeAnimationHandler {
  handleFrame(context: ProjectionNodeAnimationFrameContext): void;
}
