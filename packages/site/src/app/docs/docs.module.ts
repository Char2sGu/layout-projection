import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';
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
import { LogoComponent } from './logo/logo.component';
import { LOGO_COMPONENT } from './logo/logo.polymorphic';
import { NavComponent } from './nav/nav.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavItemGroupComponent } from './nav-item-group/nav-item-group.component';

@NgModule({
  declarations: [
    DocsComponent,
    LogoComponent,
    NavComponent,
    NavItemComponent,
    NavItemGroupComponent,
  ],
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
    LayoutProjectionModule,
    TuiDocMainModule,
    DocsRoutingModule,
  ],
  providers: [
    { provide: TUI_DOC_PAGES, useValue: DOCS_PAGES },
    { provide: TUI_DOC_LOGO, useValue: LOGO_COMPONENT },
  ],
})
export class DocsModule {}
