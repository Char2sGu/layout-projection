import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';

@NgModule({
  declarations: [DocsComponent],
  imports: [CommonModule, DocsRoutingModule, TuiAddonDocModule],
})
export class DocsModule {}
