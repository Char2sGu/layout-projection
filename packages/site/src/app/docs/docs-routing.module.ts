import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { tuiGenerateRoutes } from '@taiga-ui/addon-doc';

import { DocsComponent } from './docs.component';

const routes: Routes = tuiGenerateRoutes(DocsComponent);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocsRoutingModule {}
