import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import type { HLJSApi } from 'highlight.js';

@Injectable({ providedIn: 'root' })
export class SyntaxHighlighter {
  private engine?: HljsWithPlugins;
  private document = inject(DOCUMENT);

  async highlightElement(element: HTMLElement): Promise<void> {
    const engine = await this.loadEngine();
    engine.highlightElement(element);
    engine.lineNumbersBlock(element);
  }

  async loadEngine(): Promise<HljsWithPlugins> {
    if (this.engine) return this.engine;

    const hljs = await import('highlight.js/lib/core').then(
      (m) => m.default as HljsWithPlugins,
    );

    // expose hljs to window so that highlightjs-line-numbers.js can attach itself
    const window = this.document.defaultView;
    Object.defineProperty(window, 'hljs', { value: hljs });
    await import('highlightjs-line-numbers.js' as string);

    const languages = {
      typescript: import('highlight.js/lib/languages/typescript'),
    };
    await Promise.all(
      Object.entries(languages).map(([name, module]) =>
        module
          .then((m) => m.default)
          .then((language) => hljs.registerLanguage(name, language)),
      ),
    );

    this.engine = hljs;
    return this.engine;
  }
}

interface HljsWithPlugins extends HLJSApi {
  lineNumbersBlock(element: HTMLElement): void;
}
