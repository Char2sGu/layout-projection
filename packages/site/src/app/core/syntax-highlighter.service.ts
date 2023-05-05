import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import type { HLJSApi } from 'highlight.js';

const LANGUAGES = ['typescript', 'xml', 'bash'] as const;
type SupportedLanguage = (typeof LANGUAGES)[number];

const LANGUAGE_LOADERS = {
  typescript: () => import('highlight.js/lib/languages/typescript'),
  xml: () => import('highlight.js/lib/languages/xml'),
  bash: () => import('highlight.js/lib/languages/bash'),
} as const satisfies Record<SupportedLanguage, () => Promise<unknown>>;

const LANGUAGE_ALIASES = {
  ts: 'typescript',
  html: 'xml',
  sh: 'bash',
} as const satisfies Readonly<Record<string, SupportedLanguage>>;

@Injectable({ providedIn: 'root' })
export class SyntaxHighlighter {
  private engine?: HljsWithPlugins;
  private document = inject(DOCUMENT);

  async highlight(
    element: HTMLElement,
    content: string,
    language?: string,
  ): Promise<void> {
    const engine = await this.loadEngine();
    language = language && this.normalizeLanguage(language);
    const result = language
      ? engine.highlight(content, { language })
      : engine.highlightAuto(content, [...LANGUAGES]);
    element.innerHTML = result.value;
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

    await Promise.all(
      Object.entries(LANGUAGE_LOADERS).map(([name, moduleLoader]) =>
        moduleLoader()
          .then((m) => m.default)
          .then((language) => hljs.registerLanguage(name, language)),
      ),
    );

    this.engine = hljs;
    return this.engine;
  }

  normalizeLanguage(language: string): SupportedLanguage {
    language =
      LANGUAGE_ALIASES[language as keyof typeof LANGUAGE_ALIASES] ?? language;
    if (!LANGUAGES.includes(language as SupportedLanguage))
      throw new Error(`Unsupported language: ${language}`);
    return language as SupportedLanguage;
  }
}

interface HljsWithPlugins extends HLJSApi {
  lineNumbersBlock(element: HTMLElement): void;
}
