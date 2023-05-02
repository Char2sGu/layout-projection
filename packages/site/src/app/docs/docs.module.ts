import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, NgModule, SecurityContext } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { MarkdownElementsModule } from '../markdown-elements/markdown-elements.module';
import { MarkdownElementsRenderer } from '../markdown-elements/markdown-elements.renderer';
import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';
import { LogoComponent } from './logo/logo.component';
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
    DocsRoutingModule,
  ],
  providers: [],
})
export class DocsModule {}
