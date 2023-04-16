import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuidesComponent {}
