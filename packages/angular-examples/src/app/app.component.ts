import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

import { BasicExample } from './basic.example';
import { TabsExample } from './tabs.example';

@Component({
  selector: 'app-root',
  template: `
    <div
      class="container"
      *ngIf="examples[exampleActiveIndex] as exampleCurrent"
    >
      <h1>{{ exampleCurrent.title }}</h1>
      <main class="content">
        <ng-container
          [ngComponentOutlet]="exampleCurrent.component"
        ></ng-container>
      </main>
    </div>

    <div class="panel">
      <ul>
        <li *ngFor="let example of examples; let index = index">
          <button
            [disabled]="exampleActiveIndex === index"
            (click)="exampleActiveIndex = index"
          >
            👉
          </button>
          <span>{{ example.title }}</span>
        </li>
      </ul>
      <div class="actions">
        <button
          [disabled]="exampleActiveIndex === 0"
          (click)="exampleActiveIndex = exampleActiveIndex - 1"
        >
          Prev
        </button>
        <button
          [disabled]="exampleActiveIndex === examples.length - 1"
          (click)="exampleActiveIndex = exampleActiveIndex + 1"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .content {
        position: relative;
        width: 800px;
        height: 500px;
        border: 1px solid black;
      }

      .panel {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  examples: Example[] = [
    { title: 'Basic', component: BasicExample },
    { title: 'Tabs', component: TabsExample },
  ];

  #exampleActiveIndex = 0;
  get exampleActiveIndex(): number {
    return this.#exampleActiveIndex;
  }
  set exampleActiveIndex(v: number) {
    this.#exampleActiveIndex = v;
    localStorage.setItem('exampleActiveIndex', JSON.stringify(v));
  }

  ngOnInit(): void {
    try {
      this.#exampleActiveIndex = JSON.parse(
        localStorage.getItem('exampleActiveIndex') ?? '0',
      );
    } catch {}
  }
}

interface Example {
  title: string;
  component: Type<unknown>;
}
