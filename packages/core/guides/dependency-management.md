# Dependency Management

`@layout-projection/core` does not have a built-in Dependency Injection engine, but it makes great use of the idea of Dependency Injection and many class constructors require several dependencies as their parameters, enabling better flexibility and extensibility.

When used separately without a DI engine, `@layout-projection/core` requires developers to manually instantiate the dependencies and pass them to the constructors explicitly.

You can choose to manually instantiate dependency services every time:

```ts
new ProjectionNode(element, new ElementMeasurer(new CssBorderRadiusParser()));
```

But it's much more recommended to use an instance map instead, which borrows the core idea from DI:

```ts
const services = new Map<Function, any>();
services.set(CssBorderRadiusParser, new CssBorderRadiusParser());
services.set(
  ElementMeasurer,
  new ElementMeasurer(services.get(CssBorderRadiusParser)),
);

const node = new ProjectionNode(element, services.get(ElementMeasurer));
```

The instance map not only allow you to create only one instance of each service and use it everywhere, but also allow you to replace certain services with your own implementations to customize the behavior of the library:

```ts
class BetterElementMeasurer implements ElementMeasurer { ... }
services.set(ElementMeasurer, new BetterElementMeasurer());
```

...without changing the code of any other parts of the application, because the token for the service is the same:

```ts
const measurer = services.get(ElementMeasurer); // BetterElementMeasurer
const node = new ProjectionNode(element, measurer);
```
