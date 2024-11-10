import { Routes } from '@angular/router';

import { AdapterSingleElementComponent } from './adapter-single-element/adapter-single-element.component';
import { CoreSharedElementsComponent } from './case-shared-elements/core-shared-elements.component';
import { CoreProjectionComponent } from './core-projection/core-projection.component';
import { CoreSameElementsComponent } from './core-same-elements/core-same-elements.component';
import { OverviewComponent } from './overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OverviewComponent,
  },
  {
    path: 'core-projection',
    component: CoreProjectionComponent,
  },
  {
    path: 'core-same-elements',
    component: CoreSameElementsComponent,
  },
  {
    path: 'core-shared-element',
    component: CoreSharedElementsComponent,
  },
  {
    path: 'adapter-single-element',
    component: AdapterSingleElementComponent,
  },
];
