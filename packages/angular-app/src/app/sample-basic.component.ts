import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sample-basic',
  template: `
    <div class="wrapper" lpjAnimationScope lpjNode lpjAnimation>
      <ng-container *lpjAnimationTrigger="flag; for: 'box'"></ng-container>
      <div class="container" [class.flag]="flag" (click)="flag = !flag">
        <div class="box" lpjNode="box" lpjAnimation #entry="lpjAnimation">
          <div class="circle" lpjNode></div>
        </div>
      </div>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleBasicComponent {
  flag = false;
}
