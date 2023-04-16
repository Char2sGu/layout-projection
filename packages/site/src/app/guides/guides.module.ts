import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { MarkdownModule } from 'ngx-markdown';

import { GuideOverviewComponent } from './guide-overview/guide-overview.component';
import { GuidesComponent } from './guides.component';
import { GuidesRoutingModule } from './guides-routing.module';

@NgModule({
  declarations: [GuidesComponent, GuideOverviewComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    TuiAddonDocModule,
    MarkdownModule.forChild(),
  ],
})
export class GuidesModule {}
