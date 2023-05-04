import { InjectionToken } from '@angular/core';

import { NAV_CONTENT } from './core/nav/nav.component';

export const APP_NAV_CONTENT: typeof NAV_CONTENT extends InjectionToken<infer T>
  ? T
  : never = [
  {
    name: 'Getting Started',
    items: [
      {
        name: 'Overview',
        path: 'guides/core/overview',
      },
      {
        name: 'Layout Projection',
        path: 'guides/core/layout-projection',
      },
      {
        name: 'Layout Animation',
        path: 'guides/core/layout-animation',
      },
    ],
  },
  {
    name: 'Developer Guides',
    items: [
      {
        name: 'Snapshot APIs',
        path: 'guides/core/snapshots',
      },
      {
        name: 'Standalone Usage',
        path: 'guides/core/standalone-usage',
      },
    ],
  },
  {
    name: 'Adapter / Angular',
    items: [
      {
        name: 'Overview',
        path: 'guides/angular/overview',
      },
      {
        name: 'Projection Tree',
        path: 'guides/angular/projection-tree',
      },
      {
        name: 'Animation Directives',
        path: 'guides/angular/animation-directives',
      },
      {
        name: 'Animation Scope',
        path: 'guides/angular/animation-scope',
      },
    ],
  },
];