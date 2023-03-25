# Layout Projection / Angular

Layout Projection and Layout-Projection-powered layout animations for Angular.

```sh
npm i \
 @layout-projection/core \
 @layout-projection/angular
```

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

In the above case, `<span>` and `<p>` are not marked as nodes because they are inline elements, but marking them is completely ok and would do no harm. If you are not sure whether or not a node should be marked as a node, just mark it.

Actually, not all the non-inline elements in a component are required to be marked as nodes, and in some cases all elements in certain components do not need to be marked as nodes, but it's **strongly** recommended for beginners to do so to make sure layout animations can work properly:

## Making Layout Animations

TODO
