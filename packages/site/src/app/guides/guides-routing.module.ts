import { NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';

import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuidesComponent } from './guides.component';
import { GUIDES_PAGES } from './guides.pages';

const guidePageTitleResolver: ResolveFn<string> = (route) => {
  const path = route.params['path'];
  const page = GUIDES_PAGES.find((page) => page.route.endsWith(path));
  return page?.title ?? '';
};

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: ':path',
        component: GuideDetailComponent,
        title: guidePageTitleResolver,
        resolve: { title: guidePageTitleResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
