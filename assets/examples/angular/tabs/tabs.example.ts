import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

@Component({
  selector: 'ex-tabs',
  standalone: true,
  templateUrl: './tabs.example.html',
  styleUrls: ['./tabs.example.less'],
  imports: [CommonModule, LayoutProjectionModule],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsExample {
  tabs: Tab[] = [{ title: 'Apple' }, { title: 'Banana' }, { title: 'Orange' }];
  tabActive = this.tabs[0];
}

interface Tab {
  title: string;
}
