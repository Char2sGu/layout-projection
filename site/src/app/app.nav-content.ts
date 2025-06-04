import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
  ['General']: [],
  ['Adapters']: [
    {
      name: 'Native',
      items: [],
    },
    {
      name: 'Angular',
      items: [
        {
          name: 'Overview',
          path: 'angular/README',
        },
        {
          name: 'Tracking Layout',
          path: 'angular/guides/tracking-layout',
        },
        {
          name: 'Animating Layout',
          path: 'angular/guides/animating-layout',
        },
        {
          name: 'Defining Metadata',
          path: 'angular/guides/defining-metadata',
        },
        {
          name: 'Customizing Setup',
          path: 'angular/guides/customizing-setup',
        },
      ],
    },
  ],
  ['Kernel']: [
    {
      name: 'Core',
      items: [
        {
          name: 'Overview',
          path: 'core/README',
        },
        {
          name: 'Projection Tree',
          path: 'core/guides/projection-tree',
        },
        {
          name: 'Performing Projections',
          path: 'core/guides/performing-projections',
        },
        {
          name: 'Applying Behaviors',
          path: 'core/guides/applying-behaviors',
        },
        {
          name: 'Authoring Behaviors',
          path: 'core/guides/authoring-behaviors',
        },
      ],
    },
    {
      name: 'Animation',
      items: [
        {
          name: 'Overview',
          path: 'animation/README',
        },
        {
          name: 'Snapshots',
          path: 'animation/guides/snapshots',
        },
        {
          name: 'Animation',
          path: 'animation/guides/animation',
        },
        {
          name: 'Metadata',
          path: 'animation/guides/metadata',
        },
      ],
    },
  ],
};
