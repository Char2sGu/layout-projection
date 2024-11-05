import GitHubSlugger from 'github-slugger';
import { MarkedRenderer } from 'ngx-markdown';

import { BlockquoteComponent } from './blockquote/blockquote.component';
import { CodeblockComponent } from './codeblock/codeblock.component';
import { CodespanComponent } from './codespan/codespan.component';
import { HeadingComponent } from './heading/heading.component';
import { LinkComponent } from './link/link.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ParagraphComponent } from './paragraph/paragraph.component';

const slugger = new GitHubSlugger();

export const MARKDOWN_ELEMENTS_RENDERER = new MarkedRenderer();
MARKDOWN_ELEMENTS_RENDERER.code = (
  code: string,
  language: string | undefined,
) => {
  const element = CodeblockComponent.create();
  if (language) element.setAttribute('language', language);
  element.setAttribute('content', code);
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.codespan = (code: string) => {
  const element = CodespanComponent.create();
  element.innerHTML = code;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.link = (
  href: string | null,
  title: string | null,
  text: string,
) => {
  const element = LinkComponent.create();
  element.setAttribute('href', href ?? '');
  element.innerHTML = text;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.heading = (
  text: string,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  raw: string,
) => {
  const element = HeadingComponent.create();
  element.setAttribute('id', slugger.slug(raw));
  element.setAttribute('level', level + '');
  element.innerHTML = text;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.paragraph = (text: string) => {
  const element = ParagraphComponent.create();
  element.innerHTML = text;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.list = (body: string, ordered: boolean) => {
  const element = ListComponent.create();
  element.setAttribute('ordered', ordered + '');
  element.innerHTML = body;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.listitem = (text: string) => {
  const element = ListItemComponent.create();
  element.innerHTML = text;
  return element.outerHTML;
};
MARKDOWN_ELEMENTS_RENDERER.blockquote = (quote: string) => {
  const element = BlockquoteComponent.create();
  element.innerHTML = quote;
  return element.outerHTML;
};
