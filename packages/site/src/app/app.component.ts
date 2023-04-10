import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Type,
} from '@angular/core';

@Component({
  selector: 'lpj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  component?: Type<any>;

  constructor(private changeDetector: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    const { entry } = await import(`@layout-projection/angular-examples/basic`);
    this.component = entry;
    this.changeDetector.markForCheck();
  }
}
