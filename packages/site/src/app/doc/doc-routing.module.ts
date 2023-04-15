import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { tuiGenerateRoutes } from '@taiga-ui/addon-doc';

import { DocComponent } from './doc.component';

@NgModule({
  imports: [RouterModule.forChild(tuiGenerateRoutes(DocComponent))],
  exports: [RouterModule],
})
export class DocRoutingModule {}
