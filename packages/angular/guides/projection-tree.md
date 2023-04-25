# Projection Tree in Angular

Constructing and maintaining the Projection Tree can be quite cumbersome with `@layout-projection/core`, however, thanks to Angular directives and Angular's view-level injector hierarchy, this becomes much easier in Angular.

To add an element into the Projection Tree, simply add a `lpjNode` property to the element:

```html
<div lpjNode></div>
```

The `lpjNode` property will be selected by the `ProjectionNodeDirective`, which would:

- instantiate a `ProjectionNode` and provide it to its current view-level injector
- automatically look for the parent `ProjectionNode` through the injector tree and attach to it on instantiation
- automatically detach from the parent on destroy

### Node Identity

For cases where the `ProjectionNode` instance needs to be explicitly identified, pass the id to the `lpjNode` input:

```html
<div lpjNode="list-item-{{ item.id }}"></div>
```

### Node Deactivation

To deactivate the `ProjectionNode` instance, pass a `false` instead:

```html
<div [lpjNode]="activated ? 'list-item-{{ item.id }}' : false"></div>
```

### Node Instance Accessing

As the `ProjectionNode` instance is provided in the current view-level injector of the `[lpjNode]` directive, it can be queried through the View Query APIs just like how we access other providers provided in the component view:

```html
<div lpjNode #div></div>
```

```ts
class SomeComponent {
  @ViewChild('div', { read: ProjectionNode }) node!: ProjectionNode;
}
```

However, as the `ProjectionNodeDirective` is actually a subclass of `ProjectionNode` and the `ProjectionNode` instance we are talking about is essentially the `ProjectionNodeDirective` instance, it can be accessed much more easier by assigning to a template variable through the directive's export name `"lpjNode"`:

```html
<div lpjNode #divNode="lpjNode"></div>
```

The instance can now be directly accessed within the template, or be queried into the component class much more easier:

```html
<div lpjNode #divNode="lpjNode">Node ID: {{ divNode.id }}</div>
```

```ts
class SomeComponent {
  @ViewChild('divNode') node!: ProjectionNode;
}
```
