import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CustomElementComponent } from '../shared/custom-element';

@Component({
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IframeComponent extends CustomElementComponent implements OnInit {
  static override readonly selector = 'md-iframe';

  @Input() src?: string;
  @Input() title?: string;

  safeSrc?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    if (this.src)
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
}
