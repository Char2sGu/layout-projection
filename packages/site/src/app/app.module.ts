import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { TuiRootModule } from '@taiga-ui/core';
import { EventPluginsModule } from '@tinkoff/ng-event-plugins';
import { HIGHLIGHT_OPTIONS, HighlightOptions } from 'ngx-highlightjs';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { APP_NAV_CONTENT } from './app.nav-content';
import { AppTitleStrategy } from './app.title-strategy';
import { AppRoutingModule } from './app-routing.module';
import { LogoComponent } from './core/logo/logo.component';
import { NAV_CONTENT, NavComponent } from './core/nav/nav.component';
import { NavItemComponent } from './core/nav-item/nav-item.component';
import { NavItemGroupComponent } from './core/nav-item-group/nav-item-group.component';
import { MarkdownElementsModule } from './markdown-elements/markdown-elements.module';
import { MarkdownElementsRenderer } from './markdown-elements/markdown-elements.renderer';

// TODO: consistent styles
// TODO: scroll to route fragment element
// TODO: remove display time difference between toc and article
// TODO: article switch route animation

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    NavComponent,
    NavItemComponent,
    NavItemGroupComponent,
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
  ],
  providers: [
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js' as any),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          less: () => import('highlight.js/lib/languages/less'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      } satisfies HighlightOptions,
    },
    { provide: NAV_CONTENT, useValue: APP_NAV_CONTENT },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
