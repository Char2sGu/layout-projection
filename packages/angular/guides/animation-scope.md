# Animation Scope in Angular

In order to ensure that layout animations are predictable, the Angular adapter introduces Animation Scopes to restrict the effect of layout animations.

To declare an Animation Scope, use the `[lpjAnimationScope]` directive:

```html
<ul *lpjAnimationScope>
  <li *ngFor="let item of items" lpjNode="item-{{ item.id }}"></li>
</ul>
```

In the above example, any directives on or under the `<ul>` element will be scoped to the Animation Scope declared by the `[lpjAnimationScope]` directive.

The `[lpjAnimationScope]` directive provides contextual providers that is essential for animation directives within the Animation Scope to instantiate, which means that **animation directives must be declared under an Animation Scope**, otherwise a missing provider error would be raised at runtime.

## Shared Animation Scope

`[lpjAnimationScope]` directives create new Animation Scopes by default. However, you can pass a `LayoutAnimationScopeRef` to the directive to make it reuse an existing Animation Scope.

```html
<ng-container *lpjAnimationScope="let scopeRef">
  <ng-container *lpjAnimationScope="scopeRef"></ng-container>
</ng-container>
```

A `LayoutAnimationScopeRef` is the reference to an existing Animation Scope. `[lpjAnimationScope]` directives expose the reference to their current Animation Scopes through the `$implicit` template context property, thus you can acquire the reference using the `let variable` syntax:

```html
<ng-container *lpjAnimationScope="let scopeRef"></ng-container>
```

### Use Case

You might want to share an Animation Scope declared in the parent component with its child components in order to include Projection Nodes declared in the child components into layout animations of the parent component:

```html
<my-list *lpjAnimationScope="let animationScope">
  <my-list-item [animationScope]="animationScope"></my-list-item>
</my-list>
```

## Animation Scope Leak

Animation scopes are expected to only include directives declared within the component template, however, this is not the current behavior due to Angular injection mechanism limitations.

Currently, directive might be scoped to Animation Scopes declared on parent components if there is no `[lpjAnimationScope]` directive declared in the current component template.

This behavior will be fixed in future releases, thus you should not rely on this behavior to implicitly share parent Animation Scopes. Always explicitly pass an `LayoutAnimationScopeRef` to share Animation Scopes.
