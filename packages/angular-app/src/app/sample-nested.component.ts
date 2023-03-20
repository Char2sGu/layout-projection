import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sample-nested',
  template: `
    <div
      class="wrapper"
      lpjNode
      [animateOn]="flag"
      [animationDuration]="1000"
      (click)="flag = !flag"
    >
      <div class="container" [class.flag]="flag">
        <div class="box-outer" lpjNode="box-outer">
          <div class="box-inner" lpjNode="box-inner">
            <div class="circle" lpjNode="circle"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        background-color: cadetblue;
      }

      .wrapper {
        height: 100%;
      }

      .container {
        display: flex;
        height: 100%;
        justify-content: flex-start;
        align-items: center;
      }
      .container.flag {
        justify-content: flex-end;
      }

      .box-outer {
        display: flex;
        width: 50%;
        height: 100%;
        padding: 10px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: black;
      }
      .flag .box-outer {
        width: 40%;
        height: 80%;
        justify-content: flex-end;
      }

      .box-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        height: 40%;
        background-color: cadetblue;
      }
      .flag .box-inner {
        width: 50%;
        height: 30%;
      }

      .circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: black;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleNestedComponent {
  flag = false;
}
