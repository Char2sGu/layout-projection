import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NAV_CONTENT, NavItem, NavItemGroup } from './nav.models';

@Injectable({ providedIn: 'root' })
export class NavContentActivationDetector {
  private content = inject(NAV_CONTENT);
  private router = inject(Router);

  detect(): NavContentActivationStatus | null {
    for (const tab in this.content)
      for (const group of this.content[tab]) {
        const item = group.items.find((item) =>
          this.router.isActive(`guides/${item.path}`, {
            paths: 'exact',
            fragment: 'ignored',
            matrixParams: 'ignored',
            queryParams: 'ignored',
          }),
        );
        if (item) return { tab, group, item };
      }
    return null;
  }
}

export interface NavContentActivationStatus {
  tab: string;
  group: NavItemGroup;
  item: NavItem;
}
