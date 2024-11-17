import { inject, Injectable } from '@angular/core';
import { ProjectionNodeFactory } from '@layout-projection/angular';
import { BasicProjectionNode, ProjectionNode } from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  MeasureBorderRadius,
} from '@layout-projection/core/behaviors';

/**
 * Implementation of {@link ProjectionNodeFactory} that assembles the
 * projection node by:
 * 1. Creating a {@link BasicProjectionNode} instance.
 * 1. Applying the {@link MeasureBorderRadius} behavior.
 * 1. Applying the {@link CalibrateBorderRadius} behavior.
 *
 * When an ID is not specified, it generates an anonymous ID based on the
 * element's tagname and classes.
 * Example: `div.class1.class2{anonymous@1234}`
 */
@Injectable({ providedIn: 'root' })
export class BasicProjectionNodeFactory implements ProjectionNodeFactory {
  #borderRadiusMeasurer = inject(BorderRadiusMeasurer);
  #nextAnonymousId = 1;

  create(element: HTMLElement, id?: string): ProjectionNode {
    id ??= this.#generateAnonymousId(element);
    let instance: ProjectionNode;
    instance = new BasicProjectionNode(element, id);
    instance = MeasureBorderRadius.for(instance, this.#borderRadiusMeasurer);
    instance = CalibrateBorderRadius.for(instance);
    return instance;
  }

  #generateAnonymousId(element: HTMLElement): string {
    const tagname = element.tagName.toLowerCase();
    const classes = Array.from(element.classList).join('.');
    return `${tagname}.${classes}{anonymous@${this.#nextAnonymousId++}}`;
  }
}
