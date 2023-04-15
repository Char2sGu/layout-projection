import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';

@Component({
  selector: 'ex-list',
  standalone: true,
  templateUrl: './list.example.html',
  styleUrls: ['./list.example.less'],
  imports: [CommonModule, LayoutProjectionModule],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListExample implements OnInit {
  items: ListItem[] = [];

  private nextId = 1;

  ngOnInit(): void {
    this.addItem();
    this.addItem();
    this.addItem();
  }

  @HostListener('click')
  addItem(): void {
    this.items.push({
      id: this.nextId + '',
      title: `Item ${this.nextId}`,
      description: `Description ${this.nextId}`,
    });
    this.nextId++;
  }

  removeItem(item: ListItem): void {
    this.items = this.items.filter((i) => i !== item);
  }
}

interface ListItem {
  id: string;
  title: string;
  description: string;
}
