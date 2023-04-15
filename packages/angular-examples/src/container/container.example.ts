import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

@Component({
  selector: 'ex-container',
  standalone: true,
  templateUrl: './container.example.html',
  styleUrls: ['./container.example.less'],
  imports: [CommonModule, LayoutProjectionModule],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerExample {
  expanded = false;

  @HostListener('click')
  toggle(): void {
    this.expanded = !this.expanded;
  }
}
