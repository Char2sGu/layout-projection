# Quick Start

This guide demonstrates the basic setup and usage of the Angular adapter.

## Providing Setup

Provide the necessary dependencies at the root injector via `provideLayoutProjectionBuiltinSetup` to use the built-in implementations:

```ts
import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    // ...
    provideLayoutProjectionBuiltinSetup(),
  ],
};
```

## Tracking Layout Updates

Apply the `LayoutNode` directive on every element that needs to be tracked for layout animations:

```ts
import { LayoutNode } from '@layout-projection/angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [LayoutNode],
  template: `
    <div layout>
      <div layout></div>
      <div layout>
        <div layout></div>
      </div>
    </div>
  `,
})
class AppComponent {}
```

## Animating Layout Updates

Apply the `LayoutAnimator` directive on a `LayoutNode` element to automatically animate any layout updates happened on the elements tracked by `LayoutNode`, within its inclusive subtree:

```ts
import { LayoutNode, LayoutAnimator } from '@layout-projection/angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [LayoutNode, LayoutAnimator],
  template: `
    <div layout animate easing="linear" duration="300">
      <div layout></div>
      <div layout>
        <div layout></div>
      </div>
    </div>
  `,
})
class AppComponent {}
```

## Shared Element Transition

Assign an ID to the `LayoutNode` directive if one visual element is represented by different DOM elements in different layouts.

In the following example, the `item-overlay` element is a new DOM element for each item in the list.
By assigning the same ID to the `LayoutNode` directive, the layout animator will recognize them as the same visual element and animate the transition between them:

```ts
import { LayoutNode, LayoutAnimator } from '@layout-projection/angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [LayoutNode, LayoutAnimator],
  template: `
    <div layout animate easing="linear" duration="300">
      @for (item of items; track item.id) {
      <div layout>
        @if (activated) {
        <div layout="item-overlay"></div>
        }
      </div>
      }
    </div>
  `,
})
class AppComponent {}
```

## Online Demo

The StackBlitz example below demonstrates the usage of the Angular adapter:

<md-iframe src="https://stackblitz.com/edit/layout-projection-angular?ctl=1&embed=1&file=src%2Fmain.ts&hideExplorer=1">
</md-iframe>
