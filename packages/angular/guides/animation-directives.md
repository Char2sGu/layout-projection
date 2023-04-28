# Animation Directives for Angular

Angular directives are extremely powerful in enhancing the application in a declarative way. Several animation directives are offered in the Angular adapter for developers to create layout animations declaratively.

## Layout Animation Entry

The most top level API in the core package for performing layout animation workflows is `LayoutAnimationEntry`, which is a facade integrating many other services.

`LayoutAnimationEntry` instances are convenient to use, but instantiating them can be annoying, as the dependencies are not easy to manage. However, powered by Angular's dependency injection system, they can now be simply created by attaching a `lpjAnimation` property to a Projection Node element, which will be matched by the `LayoutAnimationEntryDirective`:

```html
<div lpjNode lpjAnimation></div>
```

Just like `ProjectionNodeDirective` is a subclass of `ProjectionNode`, `LayoutAnimationEntryDirective` is also a subclass of `LayoutAnimationEntry`, and the `LayoutAnimationEntry` instance can also be accessed in the template through the directive's export name `"lpjAnimation"`:

```html
<div lpjNode lpjAnimation #divAnimationEntry="lpjAnimation"></div>
<button (click)="divAnimationEntry.snapshot()">Snapshot</button>
```

To specify the default animation config, pass the config object as input:

```html
<div lpjNode [lpjAnimation]="{ duration: 225 }"></div>
```

### With Animation Scope

When scoped under an [Animation Scope](./animation-scope.md), only the Projection Nodes under the current Animation Scope will be snapshot and animated.

## Layout Animation Trigger

The `[lpjAnimation]` directive enables declarative instantiation of `LayoutAnimationEntry`, and the `[lpjAnimationTrigger]` directive, in the other hand, enables declarative triggering of the layout animation process, which is powered by the `LayoutAnimationEntry` instance instantiated by the `[lpjAnimation]` directive:

```html
<div lpjNode lpjAnimation [lpjAnimationTrigger]="input"></div>
```

The `[lpjAnimationTrigger]` directive would snapshot the subtree, wait for the layout change to complete, and perform the animation in proper timings based on the input.

### Trigger Input

In Angular, there is currently impossible to detect layout changes, thus an input is required to notify the animation trigger that the layout is about to change.

> The input might be optional in future releases, as the incoming [Signals RFC](https://github.com/angular/angular/discussions/49685) introduces rendering hooks like `afterRender()` to allow developers hook into the rendering process.

#### Observable as Input

Using an Observable as input is the most reliable way to trigger a layout animation.

When the input is an Observable, the animation trigger will snapshot the subtree on value emission, and then animate the subtree after an animation frame, where the DOM should have been updated but not yet rendered.

In case of a list layout change animation, the template should look like this:

```html
<mat-list lpjNode lpjAnimation [lpjAnimationTrigger]="items$">
  <mat-list-item *ngFor="let item of items$ | async" lpjNode>
    ...
  </mat-list-item>
</mat-list>
```

#### Arbitrary Expression as Input

Under certain cases, you can use an arbitrary expression as input, which is a hacky shortcut.

This shortcut is available only when:

- the `[lpjAnimationTrigger]` directive is change-detected before the elements that needs to be animated are updated, and
- the host element of the `[lpjAnimationTrigger]` directive does not participate in the layout animation,

When the input is not an Observable, the animation trigger snapshots the subtree on input binding changes, where its host element has already been updated in the DOM, the previous layout has already lost, and thus the host element will not be animated.

The previous example, where the `<mat-list>` element does not need to be animated, happens to be a perfect case for using the shortcut:

```html
<mat-list lpjNode lpjAnimation [lpjAnimationTrigger]="items.length">
  <mat-list-item *ngFor="let item of items" lpjNode> ... </mat-list-item>
</mat-list>
```

- The `<mat-list>` element is change-detected before `<mat-list-item>` elements because `<mat-list>` is their parent.
- The `<mat-list>` element, as the host element, is a container and does not participate in the layout animation.

Usually, the requirements can be met only when the `[lpjAnimationTrigger]` is attached on an element that serves as a container to the target elements that will be animated.

However, with the [standalone syntax](#standalone-syntax), the shortcut is available even at the same DOM level as long as the animation trigger is placed before the target (thus will be change-detected earlier than the target):

```html
<ng-container
  *lpjAnimationTrigger="items.length; for: listEntry"
></ng-container>
<mat-list lpjNode lpjAnimation #listEntry="lpjAnimation">
  <mat-list-item *ngFor="let item of items" lpjNode> ... </mat-list-item>
</mat-list>
```

The example above will include the `<mat-list>` element in the animation instead of only animating the `<mat-list-item>` elements.

### Standalone Syntax

`[lpjAnimationTrigger]` not only can be attached to existing `[lpjAnimation]` directives, but also can be used separately on any elements to serve as a standalone animation trigger.

In the standalone form, the `lpjAnimationTriggerFor` input must be provided to specify the target `LayoutAnimationEntry`s to be triggered:

```html
<ng-container
  [lpjAnimationTrigger]="input"
  [lpjAnimationTriggerFor]="target"
></ng-container>
```

You can use the [structural directive shorthand](https://angular.io/guide/structural-directives#structural-directive-syntax-reference) to simplify the syntax:

```html
<ng-container *lpjAnimationTrigger="input; for: target"></ng-container>
```

#### Trigger Target

The targets of an animation trigger will be dynamically resolved before every trigger.

Multiple forms of input are accepted for specifying the targets:

- An `LayoutAnimationEntry` instance:
  ```html
  <ng-container *lpjAnimationTrigger="items$; for: listEntry"></ng-container>
  <mat-list lpjNode lpjAnimation #listEntry="lpjAnimation"></mat-list>
  ```
- The corresponding `ProjectionNode` instance of an `LayoutAnimationEntry` instance **under the current Animation Scope**:
  ```html
  <ng-container *lpjAnimationScope>
    <ng-container *lpjAnimationTrigger="items$; for: listNode"></ng-container>
    <mat-list lpjNode lpjAnimation #listNode="lpjNode"></mat-list>
  </ng-container>
  ```
- The id of the corresponding `ProjectionNode` instance of an `LayoutAnimationEntry` instance **under the current Animation Scope**:
  ```html
  <ng-container *lpjAnimationScope>
    <ng-container *lpjAnimationTrigger="expanded; for: 'list'"></ng-container>
    <mat-list lpjNode="list" lpjAnimation>...<mat-list>
  </ng-container>
  ```
- An array of the above types of inputs

> Some of the forms require the `[lpjAnimationTrigger]` directive to be under an [Animation Scope](./animation-scope.md).

A standalone animation trigger can be useful in cases of

- many animation triggers for one animation entry
- one animation trigger for many animation entries
- multiple `ProjectionNode` instances for one Projection Node that needs to be dynamically resolved by id (e.g. shared-element transition)
