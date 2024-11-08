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
import { MarkdownModule, MarkdownService, MARKED_OPTIONS } from 'ngx-markdown';
import { BehaviorSubject, delay, filter, switchMap } from 'rxjs';

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
    switchMap(async (content) => {
      const cache = this.cache.get(content);
      if (cache) return cache;
      const result = await this.markdownService.parse(content);
      this.cache.set(content, result);
      return result;
    }),
  );

  @Output() render = new EventEmitter();

  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private markdownService = inject(MarkdownService);
  private markdownRenderConfig = inject(MARKED_OPTIONS);
  private cache = inject(MarkdownArticleCache);
  private elementInjector = inject(NgElementComponentInjector);
  private currentInjector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.elementInjector.use(this.currentInjector);
    this.destroyRef.onDestroy(() => this.elementInjector.use());
    this.html$
      .pipe(
        takeUntilDestroyed(),
        delay(0), // after current change detection circle
      )
      .subscribe((html) => {
        this.element.innerHTML = html;
        this.render.emit();
      });
  }
}

@Injectable({ providedIn: 'root' })
export class MarkdownArticleCache extends Map<string, string> {}
