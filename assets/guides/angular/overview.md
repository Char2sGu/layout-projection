# Angular Adapter Overview

The Angular adapter is a well designed Angular library consisting of several standalone directives and a NgModule providing services as well as importing and re-exporting all the standalone directives, enabling both standalone and non-standalone applications to declaratively opt-in the Layout Projection technique.

Although all directives from `@layout-projection/angular` are [standalone](https://angular.io/guide/standalone-components), the non-standalone style will be used in the guides by default for consistency.

## Installation

The Angular adapter package `@layout-projection/angular` should be installed along with the core package `@layout-projection/core`, as classes from the core package are used as injection tokens:

```sh
npm i \
 @layout-projection/core \
 @layout-projection/angular
```

All the directives depends on the services from the core package. In order to provide these services, import the `LayoutProjectionModule` in the root NgModule:

```ts
@NgModule({
  imports: [LayoutProjectionModule.forRoot(), ...],
  ...
})
export class AppModule {}
```

## What's Next

Checkout [Projection Tree](./projection-tree.md) to learn about how to declaratively construct the Projection Tree in Angular applications.
