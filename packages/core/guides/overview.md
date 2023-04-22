# Overview

Layout animations have always been a challenge for web developers, especially when it comes to implementing advanced layout animations like shared-element transitions.

> This [Material Motion](https://m2.material.io/design/motion/the-motion-system.html) sample provides an excellent example of what can be achieved with layout animations:
>
> ![Material Motion demo](https://user-images.githubusercontent.com/63489409/226151541-6f28fa2f-3c7c-44c1-b3c0-3dc6fcdeac8d.gif)

Layout Projection is a Web animation technique invented by [Matt Perry](https://github.com/mattgperry), which made it possible to implement GPU-accelerated layout animations by calculating and applying CSS `transform`s based on the state of the tree of elements.

> Checkout [Inside Framer Motion's Layout Animations - Matt Perry](https://www.youtube.com/watch?v=5-JIu0u42Jc) for more details.

Matt Perry heavily applied Layout Projection in [Framer Motion](https://www.framer.com/motion/), an awesome React animation library. Unfortunately, this left out web developers who don't use React.

To address this issue, we offer a **framework-agnostic** implementation of Layout Projection with various framework adapters to enable all web developers to enhance their applications with layout animations!

## Getting Started

This project consists of multiple packages, with `@layout-projection/core` serving as the framework-agnostic core for all framework adapters.

While you may not need to use `@layout-projection/core` separately in most cases, it is crucial to first review the "Getting Started" section to gain a fundamental understanding of Layout Projections and layout animations within `@layout-projection/core`.

Afterward, refer to the "Developer Guides" section for more information about the `@layout-projection/core` package or proceed directly to your preferred framework adapter to begin working with a specific framework.
