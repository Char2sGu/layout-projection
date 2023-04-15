import { ChangeDetectorRef, Injectable, OnInit, Type } from '@angular/core';
import { TuiDocExample } from '@taiga-ui/addon-doc';

import { ExampleLoader, ExampleLoaderOptions } from './example-loader.service';

@Injectable()
export abstract class ExampleComponent implements OnInit {
  content?: TuiDocExample;
  component?: Type<unknown>;

  protected abstract loaderOptions: ExampleLoaderOptions;

  constructor(
    protected loader: ExampleLoader,
    protected changeDetector: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    const result = await this.loader.load(this.loaderOptions);

    const { typescript, template, stylesheet, component } = result;
    this.content = {
      ['TypeScript']: typescript,
      ['Template']: template,
      ['Style']: stylesheet,
    };
    this.component = component;

    this.changeDetector.markForCheck();
  }
}
