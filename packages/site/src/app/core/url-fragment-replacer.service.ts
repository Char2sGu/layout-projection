import { inject, Injectable } from '@angular/core';
import { HISTORY, LOCATION } from '@ng-web-apis/common';

@Injectable({ providedIn: 'root' })
export class UrlFragmentReplacer {
  private history = inject(HISTORY);
  private location = inject(LOCATION);

  replaceWith(fragment: string): void {
    const path = this.location.pathname;
    this.history.replaceState(null, '', `${path}#${fragment}`);
  }
}
