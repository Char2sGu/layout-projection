# Layout Projection / Angular

Layout Projection and Layout-Projection-powered layout animations for Angular.

```sh
npm i \
 @layout-projection/core \
 @layout-projection/angular
```

# Examples

TODO: Online sandbox IDE links

# Tutorial

The power of Layout Projection comes from the `LayoutProjectionModule`. Make sure this module is imported in order to leverage the power.

```ts
@NgModule({
  imports: [..., LayoutProjectionModule],
})
export class AppModule {}
```

## Constructing the Projection Tree

The Layout Projection technique require a Projection Tree that is constructed based on the DOM structure to function properly.

Applying the `[lpjNode]` directive to an element would mark the element as a node of the Projection Tree. Only non-inline elements are required to be marked as nodes:

```html
<div class="card" lpjNode>
  <div class="card-title" lpjNode>
    <span>Bonjour</span>
  </div>
  <div class="card-content" lpjNode>
    <p>Hello World</p>
  </div>
  <div class="card-actions" lpjNode>
    <button class="card-action-button" lpjNode>Star</button>
    <button class="card-action-button" lpjNode>Remove</button>
  </div>
</div>
```

In the above example, `<span>` and `<p>` are not marked as nodes because they are inline elements, but marking them is completely ok and would do no harm. If you are not sure whether or not a node should be marked as a node, just mark it.

Actually, not all the non-inline elements in a component are required to be marked as nodes, and in some cases all elements in certain components do not need to be marked as nodes, but it's **strongly** recommended for beginners to do so to make sure layout animations can work properly.

We have managed to setup the infrastructure for Layout-Projection-powered layout animations. In the following chapters we'll figure out how fancy layout animations can be implemented.

## Declaring the Animation Scope

In this Angular adapter, layout animations must be scoped to avoid exceptional behaviors and make the application easier to maintain.

Before we can start configuring layout animations, we first need to declare a animation scope via the `[lpjAnimationScope]` directive:

<!-- prettier-ignore -->
```html
<div class="container" lpjAnimationScope>
  ...
</div>
```

If there is no container/wrapper elements available to attach the directive, we can simply attach it to a `<ng-container>`:

<!-- prettier-ignore -->
```html
<ng-container lpjAnimationScope>
  ...
</ng-container>
```

The animation scope provides necessary dependencies animation directives within it. Missing a scope could cause runtime Dependency Injection errors.

## Configuring the Animation Entry

Layout-Projection-powered layout animations involves a tree of nodes of the Projection Tree. Thus we need to specify the entry for a layout animation, which would be the root node of the layout animation.

To specify the entry, attach the `[lpjAnimation]` directive to a node within an animation scope:

```html
<div class="actions" lpjAnimationScope>
  <div class="button" lpjNode lpjAnimation>
    <span>Click Me</span>
  </div>
</div>
```

### Animation Customization

Layout animations for the entry can be customized by providing a configuration object to the `[lpjAnimation]` directive:

`[lpjAnimation]="{ duration: 225, easing: 'cubic-bezier(0.4,0.0,0.2,1)' }"`

The `duration` property accepts:

- a number indicating the duration of the animation in milliseconds.

The `easing` property accepts:

- a valid CSS easing function expression in string  
  e.g. `'ease-in-out'`, `'cubic-bezier(0.4,0.0,0.2,1)'`
- a [popmotion easing function](https://popmotion.io/#quick-start-easing)  
  e.g. `easeInOut`, `cubicBezier(0.4,0.0,0.2,1)`

> If you are using Angular Material, you can directly use the `AnimationCurve` enum imported from `@angular/material/core` as the `easing` configuration because as they are also valid CSS function expressions.

## Specifying the Animation Trigger

TODO

# Advanced

## Node Projection

Node Projection is the most fundamental thing that we can do with the Layout Projection technique.

A Node Projection projects a node to a specific bounding box (location & size) by calculating and applying CSS `transform`s to the node.

Thanks to our Projection Tree, when we try to project a child node whose ancestor nodes has already been projected, the `transform`s of the ancestor nodes will be involved in the calculation of the `transform` of the child node to ensure that the child node would not be distorted after the projection.

### Acquiring the Node Instance

To perform a Node Projection, we need to firstly get the target `Node` instance, which represents a specific node of the Projection Tree.

The `[lpjNode]` directive exposes the `Node` instance in the template via the name `lpjNode`:

```html
<div class="container" lpjNode #containerNode="lpjNode"></div>
```

```ts
import { Node } from "@layout-projection/core";
@ViewChild('containerNode') containerNode!: Node;
```

> A `[lpjNode]` directive provides the `Node` instance as a view provider, so we can also use the `Node` class as the selector to query all the `Node` instances from the component view:
>
> ```ts
> @ViewChildren(Node) nodes!: QueryList<Node>;
> ```

### Syncing with the DOM

The `Node` instance must know the current state of its element to perform a Node Projection. We need to invoke the `measure()` method to sync the `Node` instance with the DOM:

```ts
ngAfterViewInit(): void {
  this.contentNode.measure();
}
```

> Some properties of the instance will not be populated until measured. You might want to use the `measured()` method which is a type guard if you want to access these properties:
>
> ```ts
> if (node.measured()) {
>   doSomething(node.boundingBox);
> }
> ```

### Performing the Projection

TODO
