/* eslint-disable max-params */
import { Injectable } from '@angular/core';
import { Slugger } from 'marked';
import { MarkedRenderer } from 'ngx-markdown';

import { BlockquoteComponent } from './blockquote/blockquote.component';
import { CodeblockComponent } from './codeblock/codeblock.component';
import { CodespanComponent } from './codespan/codespan.component';
import { HeadingComponent } from './heading/heading.component';
import { LinkComponent } from './link/link.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ParagraphComponent } from './paragraph/paragraph.component';

@Injectable()
export class MarkdownElementsRenderer extends MarkedRenderer {
  constructor() {
    super();
  }

  override code(code: string, language: string | undefined): string {
    const element = CodeblockComponent.create();
    if (language) element.setAttribute('language', language);
    element.innerHTML = code;
    return element.outerHTML;
  }

  override codespan(code: string): string {
    const element = CodespanComponent.create();
    element.innerHTML = code;
    return element.outerHTML;
  }

  override link(
    href: string | null,
    title: string | null,
    text: string,
  ): string {
    const element = LinkComponent.create();
    element.setAttribute('href', href ?? '');
    element.innerHTML = text;
    return element.outerHTML;
  }

  override heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: Slugger,
  ): string {
    const element = HeadingComponent.create();
    element.setAttribute('id', slugger.slug(raw));
    element.setAttribute('level', level + '');
    element.innerHTML = text;
    return element.outerHTML;
  }

  override paragraph(text: string): string {
    const element = ParagraphComponent.create();
    element.innerHTML = text;
    return element.outerHTML;
  }

  override list(body: string, ordered: boolean): string {
    const element = ListComponent.create();
    element.setAttribute('ordered', ordered + '');
    element.innerHTML = body;
    return element.outerHTML;
  }

  override listitem(text: string): string {
    const element = ListItemComponent.create();
    element.innerHTML = text;
    return element.outerHTML;
  }

  override blockquote(quote: string): string {
    const element = BlockquoteComponent.create();
    element.innerHTML = quote;
    return element.outerHTML;
  }
}
