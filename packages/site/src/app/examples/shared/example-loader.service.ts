import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { combineLatest, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExampleLoader {
  constructor(private httpClient: HttpClient) {}

  async load(options: ExampleLoaderOptions): Promise<ExampleLoaderResult> {
    const typescript$ = this.httpClient.get(
      options.typescriptUrl, //
      { responseType: 'text' },
    );
    const template$ = this.httpClient.get(
      options.templateUrl, //
      { responseType: 'text' },
    );
    const stylesheet$ = this.httpClient.get(
      options.stylesheetUrl, //
      { responseType: 'text' },
    );

    const [typescript, template, stylesheet] = await firstValueFrom(
      combineLatest([typescript$, template$, stylesheet$]),
    );
    const module = await options.moduleLoader();

    return {
      typescript,
      template,
      stylesheet,
      component: module.entry,
    };
  }
}

export interface ExampleLoaderOptions {
  typescriptUrl: string;
  templateUrl: string;
  stylesheetUrl: string;
  moduleLoader(): Promise<{ entry: Type<unknown> }>;
}

export interface ExampleLoaderResult {
  typescript: string;
  template: string;
  stylesheet: string;
  component: Type<unknown>;
}
