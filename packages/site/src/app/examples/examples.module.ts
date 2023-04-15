import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { ExampleBasicComponent } from './example-basic/example-basic.component';
import { ExampleContainerComponent } from './example-container/example-container.component';
import { ExampleTabsComponent } from './example-tabs/example-tabs.component';
import { ExamplesComponent } from './examples.component';
import { ExamplesRoutingModule } from './examples-routing.module';

@NgModule({
  declarations: [
    ExamplesComponent,
    ExampleTabsComponent,
    ExampleBasicComponent,
    ExampleContainerComponent,
  ],
  imports: [CommonModule, ExamplesRoutingModule, TuiAddonDocModule],
})
export class ExamplesModule {}
