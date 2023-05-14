import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
  ['Angular']: [
    {
      name: 'Getting Started',
      items: [],
    },
    {
      name: 'References',
      items: [
        {
          name: 'Projection Tree',
          path: 'guides/angular/references/projection-tree',
        },
        {
          name: 'Animation Directives',
          path: 'guides/angular/references/animation-directives',
        },
        {
          name: 'Animation Scope',
          path: 'guides/angular/references/animation-scope',
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
      name: 'References',
      items: [
        {
          name: 'Layout Projection',
          path: 'guides/core/references/layout-projection',
        },
        {
          name: 'Layout Animation',
          path: 'guides/core/references/layout-animation',
        },
        {
          name: 'Snapshot APIs',
          path: 'guides/core/references/snapshots',
        },
        {
          name: 'Standalone Usage',
          path: 'guides/core/references/standalone-usage',
        },
      ],
    },
  ],
};
