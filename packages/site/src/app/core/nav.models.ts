import { InjectionToken } from '@angular/core';

export const NAV_CONTENT = new InjectionToken<NavContent>('NAV_CONTENT');

export interface NavContent {
  [tab: string]: NavItemGroup[];
}

export interface NavItemGroup {
  name: string;
  items: NavItem[];
}

export interface NavItem {
  name: string;
  path: string;
}
