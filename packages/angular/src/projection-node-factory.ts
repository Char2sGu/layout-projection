import { Injectable } from '@angular/core';
import { ProjectionNode } from '@layout-projection/core';

/**
 * Service for creating {@link ProjectionNode} objects of specific elements.
 */
@Injectable()
export abstract class ProjectionNodeFactory {
  /**
   * Create a {@link ProjectionNode} instance for the given element.
   * When the `id` is provided, the created instance has the given id.
   * Otherwise, the id of the created instance will be randomly generated.
   */
  abstract create(element: HTMLElement, id?: string): ProjectionNode;
}
