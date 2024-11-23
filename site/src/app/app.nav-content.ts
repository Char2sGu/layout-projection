import { NavContent } from './core/nav.models';

export const APP_NAV_CONTENT: NavContent = {
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
          name: 'Quick Start',
          path: 'angular/guides/quick-start',
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
          name: 'Animators',
          path: 'animation/guides/animators',
        },
        {
          name: 'Handlers & Metadata',
          path: 'animation/guides/handlers-and-metadata',
        },
      ],
    },
  ],
  ['Theory']: [],
};
