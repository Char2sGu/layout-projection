import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgElementComponent } from '../shared/ng-element';

/**
 * Accepts:
 * - `"http://example.com"`
 * - `"./filename.md"`
 * - `"#fragment"`
 */
@Component({
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent extends NgElementComponent {
  static override readonly selector = 'md-link';

  constructor(private router: Router) {
    super();
  }

  @Input() set href(value: string) {
    if (value.startsWith('http')) {
      this.link = value;
      return;
    }

    const fragment = this.router.parseUrl(value).fragment ?? undefined;
    const path = fragment ? value.replace(`#${fragment}`, '') : value;

    if (!path) {
      this.link = { path: '', fragment };
      return;
    }

    const filenameMatch = path.match(/^(?<path>.*)\/(?<filename>.*)\.md$/u);
    if (!filenameMatch) throw new Error(`Invalid link: ${path}`);
    const filename = filenameMatch?.groups?.['filename'];
    this.link = { path: `../${filename}`, fragment };
  }

  link?: string | { path: string; fragment?: string };

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
