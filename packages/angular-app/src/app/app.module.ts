import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, LayoutProjectionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
