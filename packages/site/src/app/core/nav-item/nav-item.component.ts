import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'lpj-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  @Input() @HostBinding('class.active') active = false;
}
