import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';

import { SafeValuePipe } from '../shared/safe-value.pipe';
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
import { NgElementComponentInjector } from './shared/ng-element';

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
  imports: [CommonModule, RouterModule, TuiButtonModule, SafeValuePipe],
  providers: [MarkdownElementsRenderer, NgElementComponentInjector],
})
export class MarkdownElementsModule {
  constructor(injector: NgElementComponentInjector) {
    COMPONENTS.forEach((c) => c.initialize(injector));
  }
}
