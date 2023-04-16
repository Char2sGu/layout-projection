import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuideOverviewComponent } from './guide-overview/guide-overview.component';
import { GuidesComponent } from './guides.component';

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        title: 'Overview',
        component: GuideOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
