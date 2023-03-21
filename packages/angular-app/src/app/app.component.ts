import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

import { SampleBasicComponent } from './sample-basic.component';
import { SampleBorderRadiusComponent } from './sample-border-radius.component';
import { SampleSharedElementComponent } from './sample-shared-element.component';
import { SampleStreamComponent } from './sample-stream.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" *ngIf="samples[sampleActiveIndex] as sampleCurrent">
      <h1>{{ sampleCurrent.title }}</h1>
      <main class="content">
        <ng-container
          [ngComponentOutlet]="sampleCurrent.component"
        ></ng-container>
      </main>
    </div>

    <div class="panel">
      <ul>
        <li *ngFor="let sample of samples; let index = index">
          <button
            [disabled]="sampleActiveIndex === index"
            (click)="sampleActiveIndex = index"
          >
            👉
          </button>
          <span>{{ sample.title }}</span>
        </li>
      </ul>
      <div class="actions">
        <button
          [disabled]="sampleActiveIndex === 0"
          (click)="sampleActiveIndex = sampleActiveIndex - 1"
        >
          Prev
        </button>
        <button
          [disabled]="sampleActiveIndex === samples.length - 1"
          (click)="sampleActiveIndex = sampleActiveIndex + 1"
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
  samples: Sample[] = [
    { title: 'Basic (Broken)', component: SampleBasicComponent },
    { title: 'Stream Input', component: SampleStreamComponent },
    { title: 'Border Radius', component: SampleBorderRadiusComponent },
    { title: 'Shared Element', component: SampleSharedElementComponent },
  ];

  #sampleActiveIndex = 0;
  get sampleActiveIndex(): number {
    return this.#sampleActiveIndex;
  }
  set sampleActiveIndex(v: number) {
    this.#sampleActiveIndex = v;
    localStorage.setItem('sampleActiveIndex', JSON.stringify(v));
  }

  ngOnInit(): void {
    try {
      this.#sampleActiveIndex = JSON.parse(
        localStorage.getItem('sampleActiveIndex') ?? '0',
      );
    } catch {}
  }
}

interface Sample {
  title: string;
  component: Type<unknown>;
}
