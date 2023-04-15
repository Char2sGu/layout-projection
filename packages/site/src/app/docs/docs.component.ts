import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiDocExample } from '@taiga-ui/addon-doc';

@Component({
  selector: 'lpj-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent {
  example: TuiDocExample = {
    ['TypeScript']: `Example Component`,
    ['HTML']: `Example Template`,
  };
}
