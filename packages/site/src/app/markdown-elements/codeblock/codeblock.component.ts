import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
} from '@angular/core';

import { SyntaxHighlighter } from '../../core/syntax-highlighter.service';
import { NgElementComponent } from '../shared/ng-element';

@Component({
  templateUrl: './codeblock.component.html',
  styleUrls: ['./codeblock.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeblockComponent extends NgElementComponent {
  static override readonly selector = 'md-codeblock';

  @Input() language?: string;

  @HostBinding('class') get languageBinding(): string {
    return this.language ? `language-${this.language}` : '';
  }

  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private highlighter = inject(SyntaxHighlighter);

  ngAfterViewInit(): void {
    this.highlighter.highlightElement(this.element);
  }
}
