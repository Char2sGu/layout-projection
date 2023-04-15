import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExampleComponent } from '../shared/example.component';
import { ExampleLoaderOptions } from '../shared/example-loader.service';

@Component({
  selector: 'lpj-example-list',
  templateUrl: './example-list.component.html',
  styleUrls: ['./example-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleListComponent extends ExampleComponent {
  protected override loaderOptions: ExampleLoaderOptions = {
    typescriptUrl: 'assets/examples/angular/list/list.example.ts',
    templateUrl: 'assets/examples/angular/list/list.example.html',
    stylesheetUrl: 'assets/examples/angular/list/list.example.less',
    moduleLoader: () => import('@layout-projection/angular-examples/list'),
  };
}
