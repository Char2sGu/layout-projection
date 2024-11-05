# Layout Projection / Core

Framework-agnostic implementation of Layout Projection and Layout-Projection-powered layout animations.

```sh
npm i @layout-projection/core
```

---

Layout animations have always been a challenge for web developers, especially when it comes to implementing advanced layout animations like shared-element transitions.

To address this issue, [Matt Perry](https://github.com/mattgperry) invented Layout Projection, which is a Web animation technique making it possible to implement GPU-accelerated layout animations in the Web platform by calculating and applying appropriate CSS `transform` styles on elements in each animation frame.

> Checkout [Inside Framer Motion's Layout Animations - Matt Perry](https://www.youtube.com/watch?v=5-JIu0u42Jc) for more details.

Matt Perry heavily applied the Layout Projection technique in [Framer Motion](https://www.framer.com/motion/), a well-known React animation library. Unfortunately, this left out web developers who don't use React.

Therefore, here we offer a **framework-agnostic** implementation of Layout Projection with a variety of framework adapters to enable all web developers to enhance their applications with layout animations!

## Why not FLIP?

[FLIP (First Last Invert Play)](https://aerotwist.com/blog/flip-your-animations/) is also a technique for performing layout animations using CSS `transform`s, where the elements are also `transform`ed to pretend that they are in their previous layout and then animated back to their new layouts.

However, instead of calculating `transform`s for both the element and its children and update the `transform` styles in each animation frame, FLIP simply apply a `transition` for the `transform` property and removes the entire `transform` style to animate the element, which would cause severe distortion on the child elements if the aspect ratio of the element is changed.

Layout Projection, in the other hand, perfectly prevented the distortion by animating the element frame by frame and applying a distortion-cancelling `transform` to all the child elements in each animation frame, enabling more advanced layout animations like container transforms.

## Example

In this Vanilla JS example, a layout animation will be triggered to animate elements to their new layouts once the layout is updated.

- Click on a list item to remove it.
- Click on the background to add a new item to the list.

<md-iframe src="https://stackblitz.com/edit/layout-projection-example-list?embed=1&file=index.ts&hideNavigation=1&view=preview">
</md-iframe>

## Getting Started

This project consists of multiple packages, with `@layout-projection/core` serving as the framework-agnostic core for all framework adapters.

While you may not need to use `@layout-projection/core` separately in most cases, it is crucial to first go through the "Getting Started" section to gain a fundamental understanding of Layout Projections and layout animations within `@layout-projection/core`.

Afterward, refer to the "Developer Guides" section for more information about the `@layout-projection/core` package or proceed directly to your preferred framework adapter to begin working with a specific framework.
