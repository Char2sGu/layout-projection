import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiRootModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { EventPluginsModule } from '@tinkoff/ng-event-plugins';
import { MarkdownModule, MARKED_OPTIONS, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { APP_NAV_CONTENT } from './app.nav-content';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './core/header/header.component';
import { LogoComponent } from './core/logo/logo.component';
import { NAV_CONTENT } from './core/nav.models';
import { NavComponent } from './core/nav/nav.component';
import { NavItemComponent } from './core/nav-item/nav-item.component';
import { NavItemGroupComponent } from './core/nav-item-group/nav-item-group.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { NavTabsComponent } from './core/nav-tabs/nav-tabs.component';
import { MarkdownElementsModule } from './markdown-elements/markdown-elements.module';
import { MARKDOWN_ELEMENTS_RENDERER } from './markdown-elements/markdown-elements.renderer';
import { FixLayoutOnDestroyDirective } from './shared/fix-layout-on-destroy.directive';
import { RerenderOnChangeDirective } from './shared/rerender-on-change.directive';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    NavComponent,
    NavItemComponent,
    NavItemGroupComponent,
    HeaderComponent,
    NavMenuComponent,
    NavTabsComponent,
    RerenderOnChangeDirective,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventPluginsModule,
    LayoutProjectionModule.forRoot(),
    MarkdownElementsModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: (): MarkedOptions => ({
          renderer: MARKDOWN_ELEMENTS_RENDERER,
        }),
      },
    }),
    AppRoutingModule,
    TuiRootModule,
    TuiButtonModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiScrollbarModule,
    FixLayoutOnDestroyDirective,
  ],
  providers: [
    { provide: NAV_CONTENT, useValue: APP_NAV_CONTENT },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
