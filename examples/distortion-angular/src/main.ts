import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';
import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

// Styles from motion.dev

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutNode, LayoutNodeAnimator],
  // removing the `layout` attribute from the child
  // results in distortion, as in the traditional
  // FLIP technique.
  template: `
    <div
      class="parent"
      [class.open]="open"
      layout
      duration="350"
      easing="ease-in-out"
      (click)="open = !open"
    >
      <div class="child" layout></div>
    </div>
  `,
})
export class App {
  open = false;
}

bootstrapApplication(App, {
  providers: [provideLayoutProjectionBuiltinSetup()],
});
