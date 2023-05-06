import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn,
  ResolveFn,
  RouterModule,
  Routes,
} from '@angular/router';

import { NAV_CONTENT } from '../core/nav/nav.component';
import { SyntaxHighlighter } from '../core/syntax-highlighter.service';
import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuidesComponent } from './guides.component';
import { GuideRecord } from './shared/guide.models';
import { GuideDownloader } from './shared/guide-downloader.service';

const guideRecordResolver = ((...[route]) => {
  const path = route.url.join('/');
  for (const group of inject(NAV_CONTENT)) {
    const record = group.items.find((item) => item.path.endsWith(path));
    if (!record) continue;
    return {
      name: record.name,
      path: record.path.replace(/^.*guides\//u, ''),
    };
  }
  throw new Error(`No guide found for path: ${path}`);
}) satisfies ResolveFn<GuideRecord>;

const guideContentResolver = ((...args) => {
  const record = guideRecordResolver(...args);
  return inject(GuideDownloader).download(record);
}) satisfies ResolveFn<string>;

const guideHighlighterInitializer = (() =>
  inject(SyntaxHighlighter)
    .loadEngine()
    .then(() => true)) satisfies CanActivateFn;

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'core/overview' },
      {
        path: '**',
        component: GuideDetailComponent,
        title: (...args) => guideRecordResolver(...args).name,
        resolve: { record: guideRecordResolver, content: guideContentResolver },
        canActivate: [guideHighlighterInitializer],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
