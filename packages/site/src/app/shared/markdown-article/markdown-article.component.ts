import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injectable,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { BehaviorSubject, filter, map } from 'rxjs';

import { NgElementComponentInjector } from '../../markdown-elements/shared/ng-element';

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
  @Input({ alias: 'content', required: true })
  set contentInput(v: string) { this.content$.next(v) }
  content$ = new BehaviorSubject<string>('');

  html$ = this.content$.pipe(
    filter(Boolean),
    map((content) => {
      const cache = this.cache.get(content);
      if (cache) return cache;
      const result = this.markdownService.parse(content, {
        markedOptions: this.markdownRenderConfig,
      });
      this.cache.set(content, result);
      return result;
    }),
  );

  @Output() render = new EventEmitter();

  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private markdownService = inject(MarkdownService);
  private markdownRenderConfig = inject(MarkedOptions);
  private cache = inject(MarkdownArticleCache);
  private elementInjector = inject(NgElementComponentInjector);
  private currentInjector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.elementInjector.use(this.currentInjector);
    this.destroyRef.onDestroy(() => this.elementInjector.use());
    this.html$.pipe(takeUntilDestroyed()).subscribe((html) => {
      this.element.innerHTML = html;
      this.render.emit();
    });
  }
}

@Injectable({ providedIn: 'root' })
export class MarkdownArticleCache extends Map<string, string> {}
