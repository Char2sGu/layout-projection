import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lpj-basic-example',
  standalone: true,
  template: `
    <ng-container *lpjAnimationScope>
      <div
        class="container"
        [class.flag]="flag$ | async"
        (click)="flag$.next(!flag$.value)"
      >
        <div class="box" lpjNode lpjAnimation [lpjAnimationTrigger]="flag$">
          <div class="circle" lpjNode></div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        background-color: purple;
      }

      .container {
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .container.flag {
        justify-content: flex-end;
      }

      .box {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background-color: black;
      }
      .flag .box {
        width: 30%;
        height: 50%;
        border-radius: 30%;
      }

      .circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: white;
      }
    `,
  ],
  imports: [CommonModule, LayoutProjectionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicExample {
  flag$ = new BehaviorSubject(false);
}
