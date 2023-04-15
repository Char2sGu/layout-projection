import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lpj-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocComponent {
  example = {
    ['TypeScript']: `@NgModule({
      imports: [
        CommonModule,
        MoneyModule
      ],
      exports: [ResizabledemoComponent],
      declarations: [ResizabledemoComponent]
    })`,
    ['HTML']: `<div></div>`,
  };
}
