import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { TUI_DOC_PAGES, TuiDocMainModule } from '@taiga-ui/addon-doc';
import { TUI_SANITIZER } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { HIGHLIGHT_OPTIONS, HighlightOptions } from 'ngx-highlightjs';

import { AppComponent } from './app.component';
import { APP_PAGES } from './app.pages';
import { AppTitleStrategy } from './app.title-strategy';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TuiDocMainModule,
  ],
  providers: [
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
