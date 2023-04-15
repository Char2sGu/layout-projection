import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAddonDocModule } from '@taiga-ui/addon-doc';

import { ExampleTabsComponent } from './example-tabs/example-tabs.component';
import { ExamplesComponent } from './examples.component';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExampleBasicComponent } from './example-basic/example-basic.component';

@NgModule({
  declarations: [ExamplesComponent, ExampleTabsComponent, ExampleBasicComponent],
  imports: [CommonModule, ExamplesRoutingModule, TuiAddonDocModule],
})
export class ExamplesModule {}
