# Layout Projection / Angular

Layout Projection and declarative layout animation for Angular

```sh
npm i @layout-projection/{core,animation,angular}
```

# Usage

The Angular adapter depends on several fundamental services to function. Use `provideLayoutProjectionBuiltinSetup` to provide the pre-built implementations of these services:

```ts
import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

export const APP_CONFIG: ApplicationConfig = {
  providers: [provideLayoutProjectionBuiltinSetup()],
};
```

## Animating Layout Changes

The Angular adapter introduces two handy directives, `LayoutNode` and `LayoutNodeAnimator`, that allows you to animate layout updates simply by adding an attribute:

```ts
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';

@Component({
  imports: [LayoutNode, LayoutNodeAnimator]
})
```

```html
<div layout></div>
```

This `layout` attribute animates any layout changes, including previously unavailable CSS values such as switching `justify-content` between `flex-start` and `flex-end`:

```ts
<div
  layout
  [style.justify-content]="active ? 'flex-start' : 'flex-end'"
></div>
```

> It is not required to change the layout via inline styles. You can change the layout by whatever means you like, like switching the presence of a CSS class or updating a custom attribute.

![example-switcher](https://github.com/user-attachments/assets/7d5138ec-7cf4-492e-aa58-10db3e990e75)

<md-iframe src="https://stackblitz.com/edit/layout-projection-switch?ctl=1&embed=1&file=src%2Fmain.ts&hideExplorer=1&hideNavigation=1&view=preview">
</md-iframe>

The layout change should happen immediately - no CSS transition or animation should be applied. The directives will take care of the animation and smoothly transition the layout from the old state to the new state.

A layout change can be anything:

- updating `width` or `height`
- changing number of grid columns
- adding or removing items from a list
- reordering the existing items in a list

![example-grid-shuffle](https://github.com/user-attachments/assets/dc6ec7ce-1e99-4f00-a355-0e747d50f027)

<md-iframe src="https://stackblitz.com/edit/layout-projection-grid-shuffle?ctl=1&embed=1&file=package.json&hideExplorer=1&hideNavigation=1&view=preview">
</md-iframe>

## Shared Element Transitions

Sometimes one visual element might be represented by different DOM elements in different states. For example, an underline in a tabs component might be different DOM elements when switching between tabs.

Such transitions can be implemented by assigning the same layout ID to the elements that represent the same visual element, which will result in a shared element transition.

The layout ID can be assigned by providing a value to the `layout` attribute:

````html
<!-- prettier-ignore -->
```html
@for (tab of tabs; track $index) {
<div class="tab" (click)="selectedTab = tab">
  <div class="tab-content">{{ tab.label }}</div>
  @if (tab === selectedTab) {
  <div class="tab-underline" layout="tab-underline"></div>
  }
</div>
}
````

![example-grid-tabs](https://github.com/user-attachments/assets/f0f87bf2-0ecf-4d64-b53b-c5eea3e81ad8)

<md-iframe src="https://stackblitz.com/edit/layout-projection-tabs?ctl=1&embed=1&file=package.json&hideExplorer=1&hideNavigation=1&view=preview">
</md-iframe>

Formally, in order to initiate a shared element transition:

- the old element must be removed before the new element is inserted, and
- the new element must be inserted immediately after the old element is removed (within one event loop), and
- the old and new elements must have the same layout ID

### Dynamic Layout ID

The layout ID can be dynamically determined by providing a binding expression to the `layout` attribute:

```html
<div class="tab" [layout]="tab.id"></div>
```

The expression bound to the `layout` attribute should be stable. If the expression yields multiple values, only the first value will be used as the layout ID.

### Reusing HTML ID

If an element is assigned an HTML `id`, the HTML `id` will be used as the layout ID.

The following two snippets are equivalent:

```html
<div class="tab-underline" layout="tab-underline"></div>
```

```html
<div id="tab-underline" layout></div>
```

If both the `id` attribute and the `layout` attribute are assigned a value, the
`layout` attribute will take precedence.

```html
<div id="tab-underline" layout="underline"></div>
```

In the above example, the layout ID is `underline`.

## Distortion Cancellation

The layout animations are driven by CSS `transform` styles, in order to take advantage of GPU acceleration and achieve high performance.

However, the `transform` styles can sometimes visually distort children. This is especially noticeable when the layout change involves size updates, where scaling needs to be applied to animate the size change.

```html
<div class="parent" [class.open]="open" layout (click)="open = !open">
  <div class="child"></div>
</div>
```

![example-distortion](https://github.com/user-attachments/assets/6428a883-f60e-43a2-b420-e790a605d73b)

To fix this, you can apply the directives on the direct children to cancel out the distortion:

```html
<div class="parent" [class.open]="open" layout (click)="open = !open">
  <div class="child" layout></div>
</div>
```

![example-distortion-cancelled](https://github.com/user-attachments/assets/9632c16c-3b91-4341-96ce-4a00e47002e8)

<md-iframe src="https://stackblitz.com/edit/layout-projection-distortion?ctl=1&embed=1&file=src%2Fmain.ts&hideExplorer=1&hideNavigation=1&view=preview">
</md-iframe>

Transforms can also distort `box-shadow` and `border-radius` styles. The pre-built setup has already included the distortion cancellation for these two styles.

## Skipping Size/Position

Some elements change their visual appearance between different aspect ratios, such as images and text. In such cases, you might want to skip the size animation and only animate the position changes.

The pre-built setup considers two metadata attributes during animations:

- `SKIP_SIZE` skips the size animation
- `SKIP_POSITION` skips the position animation

These metadata can be defined via the corresponding directives.

In order to skip the size animation for a specific element:

```ts
import { LayoutNode, LayoutNodeAnimator, SkipSize } from '@layout-projection/angular';

@Component({
  imports: [LayoutNode, LayoutNodeAnimator, SkipSize]
})
```

<!-- prettier-ignore -->
```html
<p layout skipSize>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</p>
```

# Customizing Setup

A setup refers to a collection of fundamental services provided at the root injector that is used by the directives to perform animations.

While the pre-built setup should be sufficient for most use cases, you can customize the setup by providing your own implementations of the services.

All the Layout Projection packages are designed following the SOLID principles and are well documented with JSDoc, making it relatively easy to hook into any procedure with your customized code. See the source code for more information.
