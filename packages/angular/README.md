# Layout Projection / Angular

Layout Projection and Layout-Projection-powered layout animations for Angular.

```sh
npm i \
 @layout-projection/core \
 @layout-projection/angular
```

# Examples

TODO: online IDE links

# Tutorial

Through this tutorial, we will build one of the simplest and the most commonly used layout animation, which is to animate the items of a list when the items changes.

## Preparation

The power of Layout Projection comes from the `LayoutProjectionModule`. Make sure this module is imported before getting started.

```ts
@NgModule({
  imports: [..., LayoutProjectionModule],
})
export class AppModule {}
```

## Constructing the Projection Tree

Before starting to configure our animations, we need to first set up the infrastructure.

The Layout Projection technique require a Projection Tree that is constructed based on the DOM structure to function properly.

Apply the `[lpjNode]` directive to an element to mark the element as a node of the Projection Tree. Only non-inline elements are required to be marked as nodes:

```html
<mat-list lpjNode>
  <mat-list-item *ngFor="let item of items$ | async" lpjNode>
    <span>{{ item.title }}</span>
  </mat-list-item>
</mat-list>
```

In this example above, `<span>` elements are not marked as nodes because they are inline elements, but marking them is completely ok and would do no harm. If you are not sure whether or not a node should be marked as a node, just mark it.

Actually, not all the non-inline elements in a component are required to be marked as nodes, and in many cases all elements in certain components do not need to be marked as nodes, but it's **strongly** recommended for beginners to do so to make sure layout animations can work properly.

## Declaring the Animation Scope

In this Angular adapter, layout animations are designed to be scoped to avoid exceptional behaviors and make the application easier to maintain.

To declare a animation scope, attach the `[lpjAnimationScope]` structural directive to an element:

<!-- prettier-ignore -->
```html
<mat-list *lpjAnimationScope lpjNode>
  ...
</mat-list>
```

Now animations declared on `<mat-list>` and any elements under `<mat-list>` will be scoped to the animation scope we just declared. Note that animation scopes declared in an component are also scoped to the component, thus we should not be able to use animation scopes declared in parent components without [sharing the animation scope](#shared-animation-scope).

We can also choose to attach the directive to an `<ng-container>` if there is no container elements available to attach to:

<!-- prettier-ignore -->
```html
<ng-container *lpjAnimationScope>
  ...
</ng-container>
```

The animation scope provides necessary dependencies for animation directives in it. Missing a scope could cause runtime Dependency Injection errors.

## Configuring the Animation Entry

Layout-Projection-powered layout animations animates a sub-tree of nodes from their previous bounding boxes (location + size) to their current bounding boxes. Thus we need to specify the entry for a layout animation, which would be the root node of tree of nodes that would be animated.

In our case, the entry can be the list element so that all the list items will be included in the sub-tree that would be animated. To specify the entry, attach the `[lpjAnimation]` directive to a node within an animation scope:

```html
<ng-container *lpjAnimationScope>
  <mat-list lpjNode lpjAnimation>
    <mat-list-item *ngFor="let item of items$ | async" lpjNode>
      <span>{{ item.title }}</span>
    </mat-list-item>
  </mat-list>
</ng-container>
```

### Animation Customization

Layout animations for the entry can be customized by providing a configuration object to the `[lpjAnimation]` directive. The default configuration is:

`[lpjAnimation]="{ duration: 225, easing: 'ease-in-out' }"`

The `duration` property accepts:

- a number indicating the duration of the animation in milliseconds.

The `easing` property accepts:

- a valid CSS easing function expression in string  
  e.g. `'ease-in-out'`, `'cubic-bezier(0.4,0.0,0.2,1)'`
- a [popmotion easing function](https://popmotion.io/#quick-start-easing)  
  e.g. `easeInOut`, `cubicBezier(0.4,0.0,0.2,1)`

> If you are using Angular Material, you can directly use the `AnimationCurve` enum imported from `@angular/material/core` as the `easing` configuration because as they are also valid CSS function expressions.

## Specifying the Animation Trigger

As mentioned, Layout-Projection-powered layout animation animates the nodes from their previous bounding boxes (location + size) to their current bounding boxes, which means that we need to snapshot the old layout before the layout changes in order to animate it.

In Angular, there is no way for us to execute some certain code automatically before a layout change, thus we need to specify the animation trigger to snapshot and animate the layout based on the input.

Attach the `[lpjAnimationTrigger]` directive to an animation entry to specify the animation trigger for that specific animation entry:

<!-- prettier-ignore -->
```html
<ng-container *lpjAnimationScope>
  <mat-list lpjNode lpjAnimation [lpjAnimationTrigger]="?">
    ...
  </mat-list>
</ng-container>
```

### Animation Trigger Input

The input for `[lpjAnimationTrigger]` is usually something consumed by the animation entry node or inner nodes, which is the `items` variable in our case. The input can be either a stream or an arbitrary expression.

#### Stream as Input

Using a stream (`Observable`) as input is the most stable way to trigger an layout animation.

When the input is a stream, the layout snapshot will be created when a new value is emitted from the stream, and then the layout will be animated after the layout is updated:

```html
<ng-container *lpjAnimationScope>
  <mat-list lpjNode lpjAnimation [lpjAnimationTrigger]="items$">
    <mat-list-item *ngFor="let item of items$ | async" lpjNode>
      {{ item.title }}
    </mat-list-item>
  </mat-list>
</ng-container>
```

#### Arbitrary Expression as Input

Using an arbitrary expression as input is available only when the node the animation trigger directive attached on is an ancestor node of the nodes that would be animated (the attached node itself does not participate in the animation).

The layout snapshot will be created when the expression's value has changed, and then the layout will be also animated after the layout is updated:

```html
<ng-container *lpjAnimationScope>
  <mat-list
    *ngIf="items$ | async as items"
    lpjNode
    lpjAnimation
    [lpjAnimationTrigger]="items"
  >
    <mat-list-item *ngFor="let item of items" lpjNode>
      <span>{{ item.title }}</span>
    </mat-list-item>
  </mat-list>
</ng-container>
```

## Final Implementation

With a few more refinements, this is how a basic list item layout animation would be implemented:

```ts
@Component(...)
export class AppComponent {
  items$ = new BehaviorSubject([
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
    { title: 'Item 4' },
  ]);

  removeFirst(): void {
    this.items$.next(this.items$.value.splice(1));
  }
}
```

```html
<ng-container *lpjAnimationScope>
  <button mat-button lpjNode (click)="removeFirst()">Remove</button>
  <mat-list
    *ngIf="items$ | async as items"
    lpjNode
    lpjAnimation
    [lpjAnimationTrigger]="items"
  >
    <mat-list-item *ngFor="let item of items" lpjNode>
      <span>{{ item.title }}</span>
    </mat-list-item>
  </mat-list>
</ng-container>
```

# Advanced

## Standalone Animation Trigger

`[lpjAnimationTrigger]` can not only be attached on existing animation entries, but also be used individually on any elements within an animation scope to serve as a standalone animation trigger.

When an animation trigger is a standalone animation trigger, the `lpjAnimationTriggerFor` input must be provided, specifying the target animation entry of this animation trigger:

```html
<ng-container *lpjAnimationTrigger="input; for: target"></ng-container>
<!-- equivalent to -->
<ng-container
  [lpjAnimationTrigger]="input"
  [lpjAnimationTriggerFor]="target"
></ng-container>
```

The `lpjAnimationTriggerFor` input accepts:

- The `Node` instance of a node serving as an animation entry in the current animation scope
  ```html
  <ng-container *lpjAnimationScope>
    <ng-container *lpjAnimationTrigger="items$; for: listNode"></ng-container>
    <mat-list lpjNode lpjAnimation #listNode="lpjNode"><mat-list>
  </ng-container>
  ```
- The ID of a node serving as an animation entry in the current animation scope
  ```html
  <ng-container *lpjAnimationScope>
    <ng-container *lpjAnimationTrigger="expanded; for: 'list'"></ng-container>
    <mat-list *ngIf="!expanded" lpjNode="list">...<mat-list>
    <mat-list *ngIf="expanded" lpjNode="list">...<mat-list>
  </ng-container>
  ```
- An array of the above types of inputs

A standalone animation trigger can be extremely useful in cases of

- many animation triggers for one animation entry
- one animation trigger for many animation entries
- different `Node` instance for the same node as the animation entry (e.g. [shared-element animations](#shared-element-animation))

## Shared-element Animation

Shared-element animations are special layout animations where a single node might be represented by two different `Node` instances.

A shared-element animation creates a smooth transition between two views by animating some common elements and make them appear to be shared elements between the views.

A common use case can be to animate the underline of a tab which indicates that the tab is active. With shared-element animation, the underline would smoothly move from tab to tab although they are actually different element instances that appear the same:

```html
<div class="tabs" *lpjAnimationScope>
  <ng-container
    *lpjAnimationTrigger="tabActive; for: 'underline'"
  ></ng-container>
  <div
    class="tab"
    [class.active]="tabActive === tab"
    *ngFor="let tab of tabs"
    (click)="tabActive = tab"
  >
    <span class="tab-title">{{ tab.title }}</span>
    <div
      *ngIf="tabActive === tab"
      class="tab-underline"
      lpjNode="underline"
      lpjAnimation
    ></div>
  </div>
</div>
```

To implement a shared-element animation, simply assign a ID to all the `Node` instances of the shared element by providing a string to the `lpjNode` input of the `[lpjNode]` directive:

```html
<div
  *ngIf="tabActive === tab"
  class="tab-underline"
  lpjNode="underline"
  lpjAnimation
></div>
```

...and use a [standalone animation trigger](#standalone-animation-trigger) to dynamically look for the animation entry by node ID:

```html
<ng-container *lpjAnimationTrigger="tabActive; for: 'underline'"></ng-container>
```

## Shared Animation Scope

Sometimes we might want to share an animation scope between components so that we can animate items in a child component from the parent component.

The `[lpjAnimationScope]` directive exports a reference to the animation scope to the `$implicit` template context property so that we can assign the reference to a template variable:

```html
<ng-container *lpjAnimationScope="let animationScope"></ng-container>
```

..., and also accepts an animation scope reference as input so that we can use an existing animation scope instead of create a new one:

```html
<ng-container *lpjAnimationScope="let animationScope">
  <ng-container *lpjAnimationScope="animationScope"></ng-container>
</ng-container>
```

In order to share an animation scope between the parent component and a child component, we can simply pass the animation scope reference to the child component as an input:

```html
<ng-container *lpjAnimationScope="let animationScope">
  <app-child [animationScope]="animationScope"></app-child>
</ng-container>
```

```ts
import { LayoutAnimationScopeRef } from "@layout-projection/angular";
@Input() animationScope?: LayoutAnimationScopeRef;
```
