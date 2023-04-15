import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Type,
} from '@angular/core';
import { TuiDocExample } from '@taiga-ui/addon-doc';

@Component({
  selector: 'lpj-example-basic',
  templateUrl: './example-basic.component.html',
  styleUrls: ['./example-basic.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleBasicComponent implements OnInit {
  example?: TuiDocExample;
  component?: Type<unknown>;

  constructor(
    private httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    const code = await this.httpClient
      .get(
        'assets/examples/angular/basic/basic.example.ts', //
        { responseType: 'text' },
      )
      .toPromise();
    this.example = { ['TypeScript']: code };
    this.component = await import(
      '@layout-projection/angular-examples/basic'
    ).then((m) => m.entry);
    this.changeDetector.markForCheck();
  }
}
