import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { CustomElementComponentInjector } from '../../markdown-elements/shared/custom-element';

@Component({
  selector: '[lpj-markdown]',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownComponent implements OnInit, OnDestroy {
  @Input() src?: string;
  @Output() ready = new EventEmitter();

  constructor(
    private currentInjector: Injector,
    private elementInjector: CustomElementComponentInjector,
  ) {}

  ngOnInit(): void {
    this.elementInjector.use(this.currentInjector);
  }

  ngOnDestroy(): void {
    this.elementInjector.use();
  }
}
