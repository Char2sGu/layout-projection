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
}
