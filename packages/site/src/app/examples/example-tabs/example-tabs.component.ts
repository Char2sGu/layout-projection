import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-example-tabs',
  templateUrl: './example-tabs.component.html',
  styleUrls: ['./example-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleTabsComponent {}
