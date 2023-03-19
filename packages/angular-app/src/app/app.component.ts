import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" lpjNode [animateOn]="flag">
      <div class="content" [class.flag]="flag" lpjNode></div>
    </div>
  `,
  styles: [
    `
      .container {
        position: relative;
        width: 500px;
        height: 500px;
        background-color: purple;
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
export class AppComponent implements OnInit {
  flag = false;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    setInterval(() => {
      this.flag = !this.flag;
      this.changeDetector.markForCheck();
    }, 1000);
  }
}
