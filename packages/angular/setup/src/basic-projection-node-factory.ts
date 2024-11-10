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

  create(element: HTMLElement): ProjectionNode {
    let instance: ProjectionNode;
    instance = new BasicProjectionNode(element);
    instance = new MeasureBorderRadius(instance, this.#borderRadiusMeasurer);
    instance = new CalibrateBorderRadius(instance);
    return instance;
  }
}
