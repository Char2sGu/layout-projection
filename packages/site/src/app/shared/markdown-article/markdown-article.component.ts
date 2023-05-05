import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';

import { CustomElementComponentInjector } from '../../markdown-elements/shared/custom-element';

@Component({
  selector: 'lpj-markdown-article',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './markdown-article.component.html',
  styleUrls: ['./markdown-article.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownArticleComponent {
  // prettier-ignore
  @Input('src') set srcInput(v: string) { this.src$.next(v); }
  src$ = new BehaviorSubject<string | null>(null);

  contentInMarkdown$ = this.src$.pipe(
    filter(Boolean),
    switchMap((src) => this.markdownService.getSource(src)),
  );
  contentInHtml$ = this.contentInMarkdown$.pipe(
    map((raw) =>
      this.markdownService.parse(raw, {
        markedOptions: this.markdownRenderConfig,
      }),
    ),
  );

  @Output() ready = new EventEmitter();

  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private markdownService = inject(MarkdownService);
  private markdownRenderConfig = inject(MarkedOptions);
  private elementInjector = inject(CustomElementComponentInjector);
  private currentInjector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.elementInjector.use(this.currentInjector);
    this.destroyRef.onDestroy(() => this.elementInjector.use());
    this.contentInHtml$.pipe(takeUntilDestroyed()).subscribe((html) => {
      this.element.innerHTML = html;
      this.ready.emit();
    });
  }
}
