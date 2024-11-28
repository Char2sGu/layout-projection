import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';
import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

// Styles from motion.dev
// https://codesandbox.io/p/sandbox/framer-motion-reorder-animation-bviz6?file=%2Fsrc%2FExample.tsx%3A23%2C27&from-embed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutNode, LayoutNodeAnimator],
  template: `
    <ul>
      @for (item of items; track item) {
      <li [layout]="item" [style.background]="item"></li>
      }
    </ul>
  `,
})
export class App {
  items = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF'];
  constructor() {
    setInterval(() => {
      this.#shuffle();
    }, 1000);
  }

  #shuffle(): void {
    this.items = this.items.sort(() => Math.random() - 0.5);
  }
}

bootstrapApplication(App, {
  providers: [provideLayoutProjectionBuiltinSetup()],
});
