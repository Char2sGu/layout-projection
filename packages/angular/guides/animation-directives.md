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

## Layout Animation Trigger

The `[lpjAnimation]` directive enables declarative instantiation of `LayoutAnimationEntry`, and the `[lpjAnimationTrigger]` directive, in the other hand, enables declarative triggering of the layout animation process, which is powered by the `LayoutAnimationEntry` instance instantiated by the `[lpjAnimation]` directive:

```html
<div lpjNode lpjAnimation [lpjAnimationTrigger]="input"></div>
```

The `[lpjAnimationTrigger]` directive would snapshot the subtree, wait for the layout change to complete, and perform the animation in proper timings based on the input.

### Layout Animation Trigger Input

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

In this case, the animation trigger snapshots the subtree when it is change-detected, and at this point its host element has already been updated and the previous layout is already lost. However, the children of the host element have not yet be updated, thus the animation trigger can successfully snapshot them for performing the layout animation.

The previous example happens to be a perfect case for using the shortcut:

```html
<mat-list lpjNode lpjAnimation [lpjAnimationTrigger]="items.length">
  <mat-list-item *ngFor="let item of items" lpjNode> ... </mat-list-item>
</mat-list>
```

- The `<mat-list>` element is change-detected before `<mat-list-item>` elements because `<mat-list>` is their parent.
- The `<mat-list>` element, as the host element, is a container and does not participate in the layout animation.

### Standalone Syntax
