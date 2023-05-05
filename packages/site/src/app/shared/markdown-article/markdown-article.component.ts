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
import { BehaviorSubject, filter, map, of, switchMap, tap } from 'rxjs';

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
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  // prettier-ignore
  @Input('src') set srcInput(v: string) { this.src$.next(v); }
  src$ = new BehaviorSubject<string | null>(null);

  content$ = this.src$.pipe(
    filter(Boolean),
    switchMap((src) => {
      const contentCache = this.cache.get(src);
      return contentCache
        ? of(contentCache)
        : this.markdownService.getSource(src).pipe(
            map((raw) =>
              this.markdownService.parse(raw, {
                markedOptions: this.markdownRenderConfig,
              }),
            ),
            tap((content) => this.cache.set(src, content)),
          );
    }),
  );

  @Output() ready = new EventEmitter();

  private markdownService = inject(MarkdownService);
  private markdownRenderConfig = inject(MarkedOptions);
  private cache = inject(MarkdownArticleCache);
  private elementInjector = inject(CustomElementComponentInjector);
  private currentInjector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.elementInjector.use(this.currentInjector);
    this.destroyRef.onDestroy(() => this.elementInjector.use());
    this.content$.pipe(takeUntilDestroyed()).subscribe((html) => {
      this.element.innerHTML = html;
      this.ready.emit();
    });
  }
}

@Injectable({ providedIn: 'root' })
export class MarkdownArticleCache extends Map<string, string> {}
