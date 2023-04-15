import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { BehaviorSubject, skip } from 'rxjs';

@Component({
  selector: 'ex-basic',
  standalone: true,
  templateUrl: './basic.example.html',
  styleUrls: ['./basic.example.less'],
  imports: [CommonModule, LayoutProjectionModule],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicExample {
  flag$ = new BehaviorSubject(false);
  flagChange$ = this.flag$.pipe(skip(1));
}