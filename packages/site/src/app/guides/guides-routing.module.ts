import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterModule,
  Routes,
} from '@angular/router';
import { TuiDocPage } from '@taiga-ui/addon-doc';

import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuidesComponent } from './guides.component';
import { GUIDES_PAGES } from './guides.pages';

const guidePageResolver = ((route: ActivatedRouteSnapshot) => {
  const filename = route.params['filename'];
  const page = GUIDES_PAGES.find((page) => page.route.endsWith(filename));
  if (!page) throw new Error(`Page ${filename} not found`);
  return page;
}) satisfies ResolveFn<TuiDocPage>;

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
      {
        path: ':filename',
        component: GuideDetailComponent,
        title: (route) => guidePageResolver(route).title,
        resolve: { page: guidePageResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
