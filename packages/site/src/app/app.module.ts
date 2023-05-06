import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, TitleStrategy } from '@angular/router';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiRootModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { EventPluginsModule } from '@tinkoff/ng-event-plugins';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { APP_NAV_CONTENT } from './app.nav-content';
import { AppRouteReuseStrategy } from './app.route-reuse-strategy';
import { AppTitleStrategy } from './app.title-strategy';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './core/header/header.component';
import { LogoComponent } from './core/logo/logo.component';
import { NAV_CONTENT } from './core/nav.models';
import { NavComponent } from './core/nav/nav.component';
import { NavItemComponent } from './core/nav-item/nav-item.component';
import { NavItemGroupComponent } from './core/nav-item-group/nav-item-group.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { MarkdownElementsModule } from './markdown-elements/markdown-elements.module';
import { MarkdownElementsRenderer } from './markdown-elements/markdown-elements.renderer';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    NavComponent,
    NavItemComponent,
    NavItemGroupComponent,
    HeaderComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventPluginsModule,
    HttpClientModule,
    LayoutProjectionModule.forRoot(),
    MarkdownElementsModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: (): MarkedOptions => ({
          renderer: inject(MarkdownElementsRenderer),
        }),
      },
    }),
    AppRoutingModule,
    TuiRootModule,
    TuiButtonModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiScrollbarModule,
  ],
  providers: [
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
    { provide: NAV_CONTENT, useValue: APP_NAV_CONTENT },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
