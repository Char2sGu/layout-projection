import { inject, Injectable } from '@angular/core';
import { ProjectionNodeFactory } from '@layout-projection/angular';
import { BasicProjectionNode, ProjectionNode } from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  MeasureBorderRadius,
} from '@layout-projection/core/behaviors';

@Injectable({ providedIn: 'root' })
export class BasicProjectionNodeFactory implements ProjectionNodeFactory {
  #borderRadiusMeasurer = inject(BorderRadiusMeasurer);
  #nextAnonymousId = 1;

  create(element: HTMLElement, id?: string): ProjectionNode {
    id ??= this.#generateAnonymousId(element);
    let instance: ProjectionNode;
    instance = new BasicProjectionNode(element, id);
    instance = new MeasureBorderRadius(instance, this.#borderRadiusMeasurer);
    instance = new CalibrateBorderRadius(instance);
    return instance;
  }

  #generateAnonymousId(element: HTMLElement): string {
    const tagname = element.tagName.toLowerCase();
    const classes = Array.from(element.classList).join('.');
    return `${tagname}.${classes}{anonymous@${this.#nextAnonymousId++}}`;
  }
}
