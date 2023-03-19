import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-sample-stream',
  template: `
    <div class="container" lpjNode [animateOn]="flag$">
      <div class="content" [class.flag]="flag$ | async" lpjNode></div>
    </div>
  `,
  styles: [
    `
      .container {
        position: relative;
        width: 500px;
        height: 500px;
        background-color: blue;
      }

      .content {
        position: absolute;
        background-color: white;
      }
      .content:not(.flag) {
        top: 100px;
        left: 100px;
        width: 100px;
        height: 100px;
      }
      .content.flag {
        bottom: 100px;
        right: 100px;
        width: 200px;
        height: 150px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleStreamComponent implements OnInit, OnDestroy {
  flag$ = new BehaviorSubject(false);

  private destroy$ = new EventEmitter();

  ngOnInit(): void {
    timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.flag$.next(!this.flag$.value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
