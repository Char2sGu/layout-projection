import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

import { SampleBasicComponent } from './sample-basic.component';
import { SampleBorderRadiusComponent } from './sample-border-radius.component';
import { SampleSharedElementComponent } from './sample-shared-element.component';
import { SampleStreamComponent } from './sample-stream.component';

@Component({
  selector: 'app-root',
  template: `
    <main *ngIf="samples[sampleActiveIndex] as sampleCurrent">
      <h1>{{ sampleCurrent.title }}</h1>
      <ng-container
        [ngComponentOutlet]="sampleCurrent.component"
      ></ng-container>
    </main>

    <div
      class="panel"
      style="position: absolute; right: 0; top: 0; display: flex; flex-direction: column; align-items: flex-end"
    >
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
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  samples: Sample[] = [
    { title: 'Basic', component: SampleBasicComponent },
    { title: 'Stream Input', component: SampleStreamComponent },
    { title: 'Border Radius', component: SampleBorderRadiusComponent },
    { title: 'Shared Element', component: SampleSharedElementComponent },
  ];
  sampleActiveIndex = 0;
}

interface Sample {
  title: string;
  component: Type<unknown>;
}
