import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { MarkdownArticleComponent } from '../shared/markdown-article/markdown-article.component';
import { MarkdownHeadingTrackingDirective } from '../shared/markdown-heading-tracking.directive';
import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuideTocComponent } from './guide-toc/guide-toc.component';
import { GuidesComponent } from './guides.component';
import { GuidesRoutingModule } from './guides-routing.module';

@NgModule({
  declarations: [GuidesComponent, GuideDetailComponent, GuideTocComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    LayoutProjectionModule,
    MarkdownHeadingTrackingDirective,
    MarkdownArticleComponent,
  ],
})
export class GuidesModule {}
