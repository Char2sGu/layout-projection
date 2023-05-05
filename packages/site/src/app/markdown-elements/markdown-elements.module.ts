import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDocCodeModule } from '@taiga-ui/addon-doc';

import { BlockquoteComponent } from './blockquote/blockquote.component';
import { CodeblockComponent } from './codeblock/codeblock.component';
import { CodespanComponent } from './codespan/codespan.component';
import { HeadingComponent } from './heading/heading.component';
import { IframeComponent } from './iframe/iframe.component';
import { LinkComponent } from './link/link.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { MarkdownElementsRenderer } from './markdown-elements.renderer';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { CustomElementComponentInjector } from './shared/custom-element';

const COMPONENTS = [
  CodeblockComponent,
  LinkComponent,
  BlockquoteComponent,
  HeadingComponent,
  ListComponent,
  ListItemComponent,
  ParagraphComponent,
  IframeComponent,
  CodespanComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RouterModule, TuiDocCodeModule],
  providers: [MarkdownElementsRenderer, CustomElementComponentInjector],
})
export class MarkdownElementsModule {
  constructor(injector: CustomElementComponentInjector) {
    COMPONENTS.forEach((c) => c.initialize(injector));
  }
}
