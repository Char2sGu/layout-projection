import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
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
      name: 'Guides',
      items: [
        {
          name: 'Layout Projection',
          path: 'core/guides/layout-projection',
        },
        {
          name: 'Layout Animation',
          path: 'core/guides/layout-animation',
        },
        {
          name: 'Snapshot APIs',
          path: 'core/guides/snapshots',
        },
        {
          name: 'Standalone Usage',
          path: 'core/guides/standalone-usage',
        },
      ],
    },
  ],
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
      name: 'Guides',
      items: [
        {
          name: 'Projection Tree',
          path: 'angular/guides/projection-tree',
        },
        {
          name: 'Animation Directives',
          path: 'angular/guides/animation-directives',
        },
        {
          name: 'Animation Scope',
          path: 'angular/guides/animation-scope',
        },
      ],
    },
  ],
};
