import { InjectionToken } from '@angular/core';

export const NAV_CONTENT = new InjectionToken<NavItemGroup[]>('NAV_CONTENT');

export interface NavItemGroup {
  name: string;
  items: NavItem[];
}

export interface NavItem {
  name: string;
  path: string;
}
