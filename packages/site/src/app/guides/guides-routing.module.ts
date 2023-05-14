import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn,
  ResolveFn,
  Route,
  RouterModule,
  ROUTES,
  Routes,
} from '@angular/router';

import { NAV_CONTENT, NavContent } from '../core/nav.models';
import { SyntaxHighlighter } from '../core/syntax-highlighter.service';
import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuidesComponent } from './guides.component';
import { GuideRecord } from './shared/guide.models';
import { GuideDownloader } from './shared/guide-downloader.service';

const routesFactory = (): Routes => [
  {
    path: '',
    component: GuidesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'angular/README',
      },
      ...generateRoutesFromNavContent(inject(NAV_CONTENT)),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [{ provide: ROUTES, useFactory: routesFactory, multi: true }],
})
export class GuidesRoutingModule {}

function generateRoutesFromNavContent(navContent: NavContent): Route[] {
  const contentResolverFactory =
    (record: GuideRecord): ResolveFn<string> =>
    () =>
      inject(GuideDownloader).download(record);

  const highlighterInitializer: CanActivateFn = () =>
    inject(SyntaxHighlighter)
      .loadEngine()
      .then(() => true);

  return Object.values(navContent)
    .flat()
    .flatMap((group) => group.items)
    .map((v): GuideRecord => v)
    .map(
      (record): Route => ({
        path: record.path,
        component: GuideDetailComponent,
        title: record.name,
        data: { record },
        resolve: { content: contentResolverFactory(record) },
        canActivate: [highlighterInitializer],
      }),
    );
}
