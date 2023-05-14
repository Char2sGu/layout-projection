import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
  ['Angular']: [
    {
      name: 'Getting Started',
      items: [
        {
          name: 'Overview',
          path: 'angular/README',
        },
      ],
    },
    {
      name: 'References',
      items: [
        {
          name: 'Projection Tree',
          path: 'angular/references/projection-tree',
        },
        {
          name: 'Animation Directives',
          path: 'angular/references/animation-directives',
        },
        {
          name: 'Animation Scope',
          path: 'angular/references/animation-scope',
        },
      ],
    },
  ],
  ['Core']: [
    {
      name: 'Getting Started',
      items: [
        {
          name: 'Overview',
          path: 'core/README',
        },
      ],
    },
    {
      name: 'References',
      items: [
        {
          name: 'Layout Projection',
          path: 'core/references/layout-projection',
        },
        {
          name: 'Layout Animation',
          path: 'core/references/layout-animation',
        },
        {
          name: 'Snapshot APIs',
          path: 'core/references/snapshots',
        },
        {
          name: 'Standalone Usage',
          path: 'core/references/standalone-usage',
        },
      ],
    },
  ],
};
