import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs';

@Component({
  selector: 'lpj-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  sidebar = false;

  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((e) => e instanceof NavigationEnd),
        delay(300),
      )
      .subscribe(() => {
        this.sidebar = false;
        this.changeDetector.markForCheck();
      });
  }

  console = console;
}
