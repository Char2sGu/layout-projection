import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExampleContainerComponent } from './example-container/example-container.component';
import { ExampleListComponent } from './example-list/example-list.component';
import { ExampleTabsComponent } from './example-tabs/example-tabs.component';
import { ExamplesComponent } from './examples.component';

const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'container' },
      {
        path: 'container',
        title: 'Container Example',
        component: ExampleContainerComponent,
      },
      {
        path: 'list',
        title: 'List Example',
        component: ExampleListComponent,
      },
      {
        path: 'tabs',
        title: 'Tabs Example',
        component: ExampleTabsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamplesRoutingModule {}
