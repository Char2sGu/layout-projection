import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  constructor(private title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined)
      this.title.setTitle(`${title} - Layout Projection`);
  }
}

@Injectable()
export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    if (future.url.toString() !== curr.url.toString()) return false;
    return super.shouldReuseRoute(future, curr);
  }
}
