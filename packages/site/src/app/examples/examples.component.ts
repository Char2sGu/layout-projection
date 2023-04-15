import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesComponent {}
