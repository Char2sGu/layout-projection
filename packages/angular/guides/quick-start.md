# Quick Start

1. Provide the necessary services at the root injector:

   ```ts
   import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

   export const APP_CONFIG: ApplicationConfig = {
     providers: [
       // ...
       provideLayoutProjectionBuiltinSetup(),
     ],
   };
   ```

2. Apply the `LayoutNode` directive on every element that needs to be tracked for layout animation:

   ```ts
   import { LayoutNode } from '@layout-projection/angular';

   @Component({
     standalone: true,
     selector: 'app-root',
     imports: [LayoutNode],
     template: `
       <div layout>
         <div layout></div>
         <div layout>
           <div layout></div>
         </div>
       </div>
     `,
   })
   class AppComponent {}
   ```

3. Apply the `LayoutAnimator` directive on a `LayoutNode` element to automatically animate any layout changes on elements tracked by `LayoutNode` within its inclusive subtree:

   ```ts
   import { LayoutNode, LayoutAnimator } from '@layout-projection/angular';

   @Component({
     standalone: true,
     selector: 'app-root',
     imports: [LayoutNode, LayoutAnimator],
     template: `
       <div layout animate easing="linear" duration="300">
         <div layout></div>
         <div layout>
           <div layout></div>
         </div>
       </div>
     `,
   })
   class AppComponent {}
   ```

4. Assign an ID to the `LayoutNode` directive if one visual element is represented by different DOM elements in different layouts:

   ```ts
   import { LayoutNode, LayoutAnimator } from '@layout-projection/angular';

   @Component({
     standalone: true,
     selector: 'app-root',
     imports: [LayoutNode, LayoutAnimator],
     template: `
       <div layout animate easing="linear" duration="300">
         @for (item of items; track item.id) {
         <div layout>
           @if (activated) {
           <div layout="item-overlay"></div>
           }
         </div>
         }
       </div>
     `,
   })
   class AppComponent {}
   ```
