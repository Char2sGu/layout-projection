import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}
