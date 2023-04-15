import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExampleComponent } from '../shared/example.component';
import { ExampleLoaderOptions } from '../shared/example-loader.service';

@Component({
  selector: 'lpj-example-tabs',
  templateUrl: './example-tabs.component.html',
  styleUrls: ['./example-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleTabsComponent extends ExampleComponent {
  protected override loaderOptions: ExampleLoaderOptions = {
    typescriptUrl: 'assets/examples/angular/tabs/tabs.example.ts',
    templateUrl: 'assets/examples/angular/tabs/tabs.example.html',
    stylesheetUrl: 'assets/examples/angular/tabs/tabs.example.less',
    moduleLoader: () => import('@layout-projection/angular-examples/tabs'),
  };
}
