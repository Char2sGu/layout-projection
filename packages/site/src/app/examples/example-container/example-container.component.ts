import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExampleComponent } from '../shared/example.component';
import { ExampleLoaderOptions } from '../shared/example-loader.service';

@Component({
  selector: 'lpj-example-container',
  templateUrl: './example-container.component.html',
  styleUrls: ['./example-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleContainerComponent extends ExampleComponent {
  protected override loaderOptions: ExampleLoaderOptions = {
    typescriptUrl: 'assets/examples/angular/container/container.example.ts',
    templateUrl: 'assets/examples/angular/container/container.example.html',
    stylesheetUrl: 'assets/examples/angular/container/container.example.less',
    moduleLoader: () => import('@layout-projection/angular-examples/container'),
  };
}
