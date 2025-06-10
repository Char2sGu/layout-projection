# Layout Projection / Core

Framework-agnostic implementation of Layout Projection

```sh
npm i @layout-projection/core
```

---

Layout Projection is the technique that computes and applies a CSS `transform` to an element to make it appear at another position and with different dimensions, while preserving the visual consistency of the element's styles before and after projection.

Layout Projection itself does not involve animation: it simply projects the element to a new position and size at a low cost, and the browser will render it immediately. Only by performing layout projection in each animation frame, we can achieve smooth animations.

This package offers the essentials for building the foundation for layout projection and performing layout projection on specific elements.
