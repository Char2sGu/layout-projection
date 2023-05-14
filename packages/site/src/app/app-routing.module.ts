import { NgModule } from '@angular/core';
import {
  RouteReuseStrategy,
  RouterModule,
  Routes,
  TitleStrategy,
} from '@angular/router';

import {
  AppRouteReuseStrategy,
  AppTitleStrategy,
} from './app-routing.strategies';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'guides',
  },
  {
    path: 'guides',
    loadChildren: () =>
      import('./guides/guides.module').then((m) => m.GuidesModule),
  },
  // TODO: 404 route
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 80],
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
  ],
})
export class AppRoutingModule {}
