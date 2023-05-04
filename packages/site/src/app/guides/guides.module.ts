import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { MarkdownComponent } from '../shared/markdown/markdown.component';
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
    MarkdownComponent,
  ],
})
export class GuidesModule {}
