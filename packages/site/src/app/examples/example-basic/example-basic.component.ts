import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-example-basic',
  templateUrl: './example-basic.component.html',
  styleUrls: ['./example-basic.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleBasicComponent {

}
