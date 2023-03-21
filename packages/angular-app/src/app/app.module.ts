import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AppComponent } from './app.component';
import { SampleBasicComponent } from './sample-basic.component';
import { SampleTabsComponent } from './sample-tabs.component';

@NgModule({
  declarations: [AppComponent, SampleBasicComponent, SampleTabsComponent],
  imports: [BrowserModule, LayoutProjectionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
