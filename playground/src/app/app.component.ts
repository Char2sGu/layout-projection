/* eslint-disable no-console */
import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { experimental as e, Layout } from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  CssBorderRadiusParser,
} from '@layout-projection/core/behaviors';

@Component({
  selector: 'lpj-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  container = viewChild.required<ElementRef<HTMLElement>>('container');
  content = viewChild.required<ElementRef<HTMLElement>>('content');

  ngAfterViewInit(): void {
    const container = this.createNode(this.container().nativeElement);
    const content = this.createNode(this.content().nativeElement);
    content.attach(container);
    container.measure();
    content.measure();
    container.project(
      new Layout({
        top: 50,
        left: 50,
        right: window.innerWidth,
        bottom: window.innerHeight,
      }),
    );
    console.log(
      content.project(
        new Layout({
          top: window.innerHeight - 100,
          left: window.innerWidth / 2,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      ),
    );
  }

  createNode(element: HTMLElement): e.ProjectionNode {
    let node: e.ProjectionNode = new e.BasicProjectionNode(element);
    node = new CalibrateBorderRadius(
      node,
      new BorderRadiusMeasurer(new CssBorderRadiusParser()),
    );
    return node;
  }
}
