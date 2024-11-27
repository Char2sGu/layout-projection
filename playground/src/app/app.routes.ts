import { Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OverviewComponent,
  },
  {
    path: 'core-projection',
    loadComponent: () =>
      import('./core-projection/core-projection.component').then(
        (m) => m.CoreProjectionComponent,
      ),
  },
  {
    path: 'core-same-elements',
    loadComponent: () =>
      import('./core-same-elements/core-same-elements.component').then(
        (m) => m.CoreSameElementsComponent,
      ),
  },
  {
    path: 'core-shared-element',
    loadComponent: () =>
      import('./core-shared-element/core-shared-elements.component').then(
        (m) => m.CoreSharedElementsComponent,
      ),
  },
  {
    path: 'adapter-single-element',
    loadComponent: () =>
      import('./adapter-single-element/adapter-single-element.component').then(
        (m) => m.AdapterSingleElementComponent,
      ),
  },
  {
    path: 'adapter-nested-elements',
    loadComponent: () =>
      import(
        './adapter-nested-elements/adapter-nested-elements.component'
      ).then((m) => m.AdapterNestedElementsComponent),
  },
  {
    path: 'adapter-metadata',
    loadComponent: () =>
      import('./adapter-metadata/adapter-metadata.component').then(
        (m) => m.AdapterMetadataComponent,
      ),
  },
];
