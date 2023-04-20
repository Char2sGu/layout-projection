import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CustomElementComponent } from '../shared/custom-element';

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
    const fragment = this.router.parseUrl(value).fragment ?? undefined;
    const pathRaw = fragment ? value.replace(`#${fragment}`, '') : value;
    const filenameMatch = pathRaw.match(/^(?<path>.*)\/(?<filename>.*)\.md$/u);
    if (!filenameMatch) throw new Error(`Invalid link: ${pathRaw}`);
    const filename = filenameMatch?.groups?.['filename'];
    this.link = { path: `../${filename}`, fragment };
  }

  link?: string | { path: string; fragment?: string };

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
