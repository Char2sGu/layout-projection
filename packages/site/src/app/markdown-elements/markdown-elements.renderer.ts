import { Injectable } from '@angular/core';
import { MarkedRenderer } from 'ngx-markdown';

import { CodeblockComponent } from './codeblock/codeblock.component';

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
    const element = document.createElement('md-link');
    element.setAttribute('href', href ?? '');
    element.innerText = text;
    return element.outerHTML;
  }

  override paragraph(text: string): string {
    return `<p class="tui-text_body-m">${text}</p>`;
  }

  override list(body: string, ordered: boolean): string {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag} class="tui-list tui-list_small">\n${body}\n</${tag}>`;
  }

  override listitem(text: string): string {
    return `<li class="tui-list__item">${text}</li>`;
  }
}
