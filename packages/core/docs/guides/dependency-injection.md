# Dependency Injection

`@layout-projection/core` does not have a Dependency Injection engine built-in, while it makes great use of the idea of Dependency Injection and many class constructors require several dependencies to be passed explicitly, enabling better flexibility and extensibility.

When used separately without a framework adapter, `@layout-projection/core` requires developers to manually instantiate the dependencies and pass them to the constructors explicitly:

```ts
const services = new Map<Function, any>();
services.set(CssBorderRadiusParser, new CssBorderRadiusParser());
services.set(
  ElementMeasurer,
  new ElementMeasurer(services.get(CssBorderRadiusParser)),
);

const node = new ProjectionNode(element, services.get(ElementMeasurer));
```

Developers can replace certain services with their own implementations to customize the behavior of the library:

```ts
class BetterElementMeasurer implements ElementMeasurer {}
services.set(ElementMeasurer, BetterElementMeasurer);
```

...while the other part of the application does not need to be updated as the token for the service didn't change:

```ts
services.get(ElementMeasurer); // BetterElementMeasurer
const node = new ProjectionNode(element, services.get(ElementMeasurer));
```
