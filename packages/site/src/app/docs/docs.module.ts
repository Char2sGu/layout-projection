import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import {
  TUI_DOC_LOGO,
  TUI_DOC_PAGES,
  TuiDocMainModule,
} from '@taiga-ui/addon-doc';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { MarkdownElementsModule } from '../markdown-elements/markdown-elements.module';
import { MarkdownElementsRenderer } from '../markdown-elements/markdown-elements.renderer';
import { DocsComponent } from './docs.component';
import { DOCS_PAGES } from './docs.pages';
import { DocsRoutingModule } from './docs-routing.module';
import { LOGO_COMPONENT } from './logo/logo.polymorphic';

@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule,
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
    DocsRoutingModule,
  ],
  providers: [
    { provide: TUI_DOC_PAGES, useValue: DOCS_PAGES },
    { provide: TUI_DOC_LOGO, useValue: LOGO_COMPONENT },
  ],
})
export class DocsModule {}
