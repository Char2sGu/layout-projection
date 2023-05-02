import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lpj-nav-item-group',
  templateUrl: './nav-item-group.component.html',
  styleUrls: ['./nav-item-group.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemGroupComponent {
  @Input() heading?: string;
}
