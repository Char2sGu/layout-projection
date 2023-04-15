import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExampleComponent } from '../shared/example.component';
import { ExampleLoaderOptions } from '../shared/example-loader.service';

@Component({
  selector: 'lpj-example-basic',
  templateUrl: './example-basic.component.html',
  styleUrls: ['./example-basic.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleBasicComponent extends ExampleComponent {
  protected override loaderOptions: ExampleLoaderOptions = {
    typescriptUrl: 'assets/examples/angular/basic/basic.example.ts',
    templateUrl: 'assets/examples/angular/basic/basic.example.html',
    stylesheetUrl: 'assets/examples/angular/basic/basic.example.less',
    moduleLoader: () => import('@layout-projection/angular-examples/basic'),
  };
}
