import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDocCodeModule } from '@taiga-ui/addon-doc';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiNotificationModule,
} from '@taiga-ui/core';

import { BlockquoteComponent } from './blockquote/blockquote.component';
import { CodeblockComponent } from './codeblock/codeblock.component';
import { HeadingComponent } from './heading/heading.component';
import { LinkComponent } from './link/link.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { MarkdownElementsRenderer } from './markdown-elements.renderer';
import { ParagraphComponent } from './paragraph/paragraph.component';

const COMPONENTS = [
  CodeblockComponent,
  LinkComponent,
  BlockquoteComponent,
  HeadingComponent,
  ListComponent,
  ListItemComponent,
  ParagraphComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    TuiDocCodeModule,
    TuiNotificationModule,
    TuiButtonModule,
    TuiLinkModule,
  ],
  providers: [MarkdownElementsRenderer],
})
export class MarkdownElementsModule {
  constructor(injector: Injector) {
    COMPONENTS.forEach((c) => c.initialize(injector));
  }
}
