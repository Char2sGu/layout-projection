import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent {}
