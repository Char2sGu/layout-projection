/* eslint-disable no-console */
import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { experimental as e, Layout } from '@layout-projection/core';

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
    const container = new e.BasicProjectionNode(this.container().nativeElement);
    const content = new e.BasicProjectionNode(this.content().nativeElement);
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
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      ),
    );
  }
}
