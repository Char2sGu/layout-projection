import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { MarkedRenderer } from 'ngx-markdown';

import { CodeblockComponent } from './codeblock/codeblock.component';
import { LinkComponent } from './link/link.component';
import { NotificationComponent } from './notification/notification.component';

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
    element.innerText = text;
    return element.outerHTML;
  }

  override heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6): string {
    if (level <= 4) return `<h1 class="tui-text_h${level + 2}">${text}</h1>`;
    if (level === 5) return `<h1 class="tui-text_body-xl"><b>${text}</b></h1>`;
    return `<h1 class="tui-text_body-l"><b>${text}</b></h1>`;
  }

  override paragraph(text: string): string {
    return `<p class="tui-text_body-m">${text}</p>`;
  }

  override list(body: string, ordered: boolean): string {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag} class="tui-list">\n${body}\n</${tag}>`;
  }

  override listitem(text: string): string {
    return `<li class="tui-list__item">${text}</li>`;
  }

  override blockquote(
    this: marked.Renderer<never> | marked.RendererThis,
    quote: string,
  ): string {
    const element = NotificationComponent.create();
    element.innerHTML = quote;
    return element.outerHTML;
  }
}
