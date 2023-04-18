import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { MarkedRenderer } from 'ngx-markdown';

import { BlockquoteComponent } from './blockquote/blockquote.component';
import { CodeblockComponent } from './codeblock/codeblock.component';
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
    const content = '```' + (language ?? '') + '\n' + code + '\n' + '```';
    const element = CodeblockComponent.create();
    element.setAttribute('content', content);
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
    this: marked.Renderer<never> | marked.RendererThis,
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: marked.Slugger,
  ): string {
    const element = HeadingComponent.create();
    element.id = slugger.slug(text);
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

  override blockquote(
    this: marked.Renderer<never> | marked.RendererThis,
    quote: string,
  ): string {
    const element = BlockquoteComponent.create();
    element.innerHTML = quote;
    return element.outerHTML;
  }
}
