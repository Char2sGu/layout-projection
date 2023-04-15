import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { ExampleContainerComponent } from './example-container/example-container.component';
import { ExampleListComponent } from './example-list/example-list.component';
import { ExampleTabsComponent } from './example-tabs/example-tabs.component';
import { ExamplesComponent } from './examples.component';
import { ExamplesRoutingModule } from './examples-routing.module';

@NgModule({
  declarations: [
    ExamplesComponent,
    ExampleTabsComponent,
    ExampleContainerComponent,
    ExampleListComponent,
  ],
  imports: [CommonModule, ExamplesRoutingModule, TuiAddonDocModule],
})
export class ExamplesModule {}
