import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { MarkdownComponent } from '../shared/markdown/markdown.component';
import { GuideDetailComponent } from './guide-detail/guide-detail.component';
import { GuidesComponent } from './guides.component';
import { GuidesRoutingModule } from './guides-routing.module';

@NgModule({
  declarations: [GuidesComponent, GuideDetailComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    TuiAddonDocModule,
    MarkdownComponent,
  ],
})
export class GuidesModule {}
