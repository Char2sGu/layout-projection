import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CustomElementComponent } from '../shared/custom-element';

@Component({
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent extends CustomElementComponent {
  static override readonly selector = 'md-link';

  constructor(private router: Router) {
    super();
  }

  @Input() set href(value: string) {
    if (value.startsWith('http')) {
      this.link = value;
      return;
    }
    const urlTree = this.router.parseUrl(value);
    const fragment = urlTree.fragment ?? undefined;
    const path = fragment ? value.replace(`#${fragment}`, '') : value;
    this.link = { path, fragment };
  }

  link?: string | { path: string; fragment?: string };

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
