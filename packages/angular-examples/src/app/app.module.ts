import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AppComponent } from './app.component';
import { BasicExample } from './basic.example';
import { TabsExample } from './tabs.example';

@NgModule({
  declarations: [AppComponent, BasicExample, TabsExample],
  imports: [BrowserModule, LayoutProjectionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
