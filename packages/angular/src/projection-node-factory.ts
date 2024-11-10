import { Injectable } from '@angular/core';
import { ProjectionNode } from '@layout-projection/core';

@Injectable()
export abstract class ProjectionNodeFactory {
  /**
   * Create a {@link ProjectionNode} instance for the given element.
   */
  abstract create(element: HTMLElement): ProjectionNode;
}
