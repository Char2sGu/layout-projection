import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
} from '@angular/core';
import { filter, take } from 'rxjs';

import { VisibilityObserver } from '../../core/visibility-observer.service';
import { NgElementComponent } from '../shared/ng-element';

@Component({
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IframeComponent extends NgElementComponent {
  static override readonly selector = 'md-iframe';

  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private visibilityObserver = inject(VisibilityObserver);

  @Input() src?: string;
  @Input() title?: string;

  render$ = this.visibilityObserver
    .observe(this.element)
    .pipe(filter(Boolean), take(1));
}
