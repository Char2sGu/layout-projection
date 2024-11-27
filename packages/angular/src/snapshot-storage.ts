import { Injectable } from '@angular/core';
import { ProjectionNodeSnapshot } from '@layout-projection/animation';

/**
 * The global storage for {@link ProjectionNodeSnapshot} objects.
 * The key is the identity of the corresponding {@link ProjectionNode} instance.
 */
@Injectable({ providedIn: 'root' })
export class SnapshotStorage extends Map<string, ProjectionNodeSnapshot> {}
