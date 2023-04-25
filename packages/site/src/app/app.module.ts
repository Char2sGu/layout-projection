import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { LayoutProjectionModule } from '@layout-projection/angular';
import {
  TUI_DOC_LOGO,
  TUI_DOC_PAGES,
  TuiDocMainModule,
} from '@taiga-ui/addon-doc';
import { HIGHLIGHT_OPTIONS, HighlightOptions } from 'ngx-highlightjs';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { APP_PAGES } from './app.pages';
import { AppTitleStrategy } from './app.title-strategy';
import { AppRoutingModule } from './app-routing.module';
import { LogoComponent } from './core/logo/logo.component';
import { LOGO_COMPONENT } from './core/logo/logo.polymorphic';
import { MarkdownElementsModule } from './markdown-elements/markdown-elements.module';
import { MarkdownElementsRenderer } from './markdown-elements/markdown-elements.renderer';

@NgModule({
  declarations: [AppComponent, LogoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    TuiDocMainModule,
    AppRoutingModule,
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
    {
      provide: TUI_DOC_PAGES,
      useValue: APP_PAGES,
    },
    { provide: TUI_DOC_LOGO, useValue: LOGO_COMPONENT },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
