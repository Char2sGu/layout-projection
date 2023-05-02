import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsComponent } from './docs.component';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'guides',
      },
      {
        path: 'guides',
        loadChildren: () =>
          import('../guides/guides.module').then((m) => m.GuidesModule),
      },
      {
        path: 'examples',
        loadChildren: () =>
          import('../examples/examples.module').then((m) => m.ExamplesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocsRoutingModule {}
