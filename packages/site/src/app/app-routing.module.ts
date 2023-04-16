import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'guides',
  },
  {
    path: 'examples',
    loadChildren: () =>
      import('./examples/examples.module').then((m) => m.ExamplesModule),
  },
  {
    path: 'guides',
    loadChildren: () =>
      import('./guides/guides.module').then((m) => m.GuidesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
