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
    <div class="wrapper" lpjNode [animateOn]="flag$">
      <div class="content" [class.flag]="flag$ | async" lpjNode></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        background-color: purple;
      }

      .wrapper {
        height: 100%;
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
