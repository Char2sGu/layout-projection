import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
  ['Angular']: [
    {
      name: 'Getting Started',
      items: [],
    },
    {
      name: 'Fundamentals',
      items: [
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
  ],
  ['Core']: [
    {
      name: 'Getting Started',
      items: [],
    },
    {
      name: 'Fundamentals',
      items: [
        {
          name: 'Layout Projection',
          path: 'guides/core/layout-projection',
        },
        {
          name: 'Layout Animation',
          path: 'guides/core/layout-animation',
        },
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
  ],
};
