# Layout Projection

**_Beautify the Web with awesome layout animations_**

Framework-agnostic **Layout Projection** and **Layout-Projection-powered** layout animation implementations with exquisite adapters for various frameworks.

# Getting Started

- [Getting started with Vanilla JavaScript](./packages/core/README.md)
- [Getting started with Angular](./packages/angular/README.md)
- ... (contribute for more framework adapters)

Checkout the [website](https://thenightmarex.github.io/layout-projection) for live demos!

# What Is Layout Projection?

Layout animations can always be the shortage of Web applications and it's always been expensive and difficult for Web developers to implement advanced layout animations especially shared-element transitions.

> This [Material Motion](https://m2.material.io/design/motion/the-motion-system.html) sample is a good example illustrating what layout animations can be like:
>
> ![Material Motion demo](https://user-images.githubusercontent.com/63489409/226151541-6f28fa2f-3c7c-44c1-b3c0-3dc6fcdeac8d.gif)

Layout Projection is a Web animation technique invented by [Matt Perry](https://github.com/mattgperry), which made it possible to implement layout animations in a performance-aware way by calculating and applying CSS `transform`s based on the state of the tree of elements.

> Checkout [Inside Framer Motion's Layout Animations - Matt Perry](https://www.youtube.com/watch?v=5-JIu0u42Jc) for more details.

Matt Perry, as a member of Framer, applied Layout Projection heavily in their awesome React animation library [Framer Motion](https://www.framer.com/motion/), but unfortunately all Web developers not using React have been left over.

Therefore, in this project, we offer you a **framework-agnostic** Layout Projection implementation with various framework adapters to allow all Web developers to enhance their Web applications with Layout Projection!

# Special Thanks

Big thank to [@taowen](https://github.com/taowen) for providing [the GitHub Gist copy](https://gist.github.com/taowen/e102cf5731e527cb9ac02574783c4119) of the missing original blog by Matt Perry about the tech details of Layout Projection.
