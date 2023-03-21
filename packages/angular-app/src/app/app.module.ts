import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AppComponent } from './app.component';
import { SampleBasicComponent } from './sample-basic.component';
import { SampleSharedElementComponent } from './sample-shared-element.component';

@NgModule({
  declarations: [
    AppComponent,
    SampleBasicComponent,
    SampleSharedElementComponent,
  ],
  imports: [BrowserModule, LayoutProjectionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
