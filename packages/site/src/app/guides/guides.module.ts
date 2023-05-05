import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { MarkdownArticleComponent } from '../shared/markdown-article/markdown-article.component';
import { PreferUndefinedPipe } from '../shared/prefer-undefined.pipe';
import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuideTocComponent } from './guide-toc/guide-toc.component';
import { GuidesComponent } from './guides.component';
import { GuidesRoutingModule } from './guides-routing.module';
import { GuideTocItemOfHeadingPipe } from './shared/guide-toc-item-of-heading.pipe';
import { GuideTocItemsFromHeadingsPipe } from './shared/guide-toc-items-from-headings.pipe';

@NgModule({
  declarations: [
    GuidesComponent,
    GuideDetailComponent,
    GuideTocComponent,
    GuideTocItemsFromHeadingsPipe,
    GuideTocItemOfHeadingPipe,
  ],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    LayoutProjectionModule,
    MarkdownArticleComponent,
    PreferUndefinedPipe,
  ],
})
export class GuidesModule {}
