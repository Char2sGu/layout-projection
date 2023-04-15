import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { DocComponent } from './doc.component';
import { DocRoutingModule } from './doc-routing.module';

@NgModule({
  declarations: [DocComponent],
  imports: [CommonModule, DocRoutingModule, TuiAddonDocModule],
})
export class DocModule {}
