# Layout Projection

**_Beautify the Web with awesome layout animations_**

Framework-agnostic **Layout Projection** and GPU-accelerated layout animation with various framework adapters.

> [!CAUTION]
> This project is currently under a massive re-design, and the tutorials and website is not yet updated.  
> Please stay tuned and come back later!

## Getting Started

- [Vanilla JS](https://char2sgu.github.io/layout-projection/)
- [Angular Adapter](./packages/angular/README.md)

## Project Structure

| Path                | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `package/core`      | framework-agnostic implementation of Layout Projection                  |
| `package/animation` | framework-agnostic layout animation powered by Layout Projection        |
| `package/angular`   | framework adapter for Angular                                           |
| `site`              | Angular application of the documentation website                        |
| `playground`        | Angular application serving as the test field of all the packages above |

## What is this?

Layout animations have always been a challenge for web developers, especially when it comes to implementing advanced layout animations like shared-element transitions.

To address this issue, [Matt Perry](https://github.com/mattgperry) invented Layout Projection, which is a Web animation technique making it possible to implement GPU-accelerated layout animations in the Web platform by calculating and applying appropriate CSS `transform` styles on elements in each animation frame.

> Checkout [Inside Framer Motion's Layout Animations - Matt Perry](https://www.youtube.com/watch?v=5-JIu0u42Jc) for more details.

Matt Perry heavily applied the Layout Projection technique in [Framer Motion](https://www.framer.com/motion/), a well-known React animation library. Unfortunately, this left out web developers who don't use React.

Therefore, in this project, we aim to offer a **framework-agnostic** implementation of Layout Projection with a variety of framework adapters, to enable all web developers to enhance their applications with layout animations!

## Why not FLIP?

[FLIP (First Last Invert Play)](https://aerotwist.com/blog/flip-your-animations/) is also a technique for performing layout animations using CSS `transform`s, where the elements are also `transform`ed to pretend that they were in their previous layout and then animated back to their new layouts.

However, FLIP is a very simple technique with a lot of drawbacks. FLIP did not take the parent `transform`s into consideration, which causes severe layout distortion when a FLIP animation changes the aspect ratio of an element, or when one FLIP animation is performed inside another.

This makes FLIP only applicable for very simple cases where only the position of element needs to be animated and no nesting animation is required, such as animating the layout changes of items in a list.

Layout Projection, on the other hand, is much more advanced and perfectly addressed the distortion by constructing a tree structure based on the DOM, so that parent `transform`s can be tracked and canceled by applying an accurately calculated `transform` to the child element, enabling much more advanced layout animations.

## Why not View Transition API?

Nice catch! Why don't we use the shiny brand new [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)? It is true that View Transition API allows you to implement any layout animation that Layout Projection can implement, and View Transition API sometimes does even a better job for shared-element layout animation across multiple layers of DOM structures. View Transition API requires even less setup - it does not require maintaining a Projection Tree.

There is really no clear answer on which one is better, since View Transition API and Layout Projection focus on different types of layout animations.

View Transition API animates the entire viewport by creating an overlay on top of it, which is interruptive and expensive, making it more appropriate for large-scale layout animations such the transition between pages.

Layout Projection animates specifically the changed elements, and most of our framework adapters allows automatic layout animations whenever the layout changes. Therefore, Layout Projection would be much more convenient for relative small but exquisite interaction animations.

Using View Transition API does not mean you don't need Layout Projection. They can co-exist and work well together!

## Special Thanks

Big thank to [@taowen](https://github.com/taowen) for providing [the GitHub Gist copy](https://gist.github.com/taowen/e102cf5731e527cb9ac02574783c4119) of the missing original blog by Matt Perry about the tech details of Layout Projection.
