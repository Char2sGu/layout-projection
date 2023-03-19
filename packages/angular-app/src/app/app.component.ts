import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

import { SampleBasicComponent } from './sample-basic.component';
import { SampleSharedElementComponent } from './sample-shared-element.component';
import { SampleStreamComponent } from './sample-stream.component';

@Component({
  selector: 'app-root',
  template: `
    <main *ngIf="samples[sampleActiveIndex] as sample">
      <h1>{{ sample.title }}</h1>
      <ng-container [ngComponentOutlet]="sample.component"></ng-container>
    </main>

    <div class="actions" style="position: absolute; right: 0; bottom: 0">
      <button
        (click)="sampleActiveIndex = sampleActiveIndex - 1"
        [disabled]="sampleActiveIndex === 0"
      >
        Prev
      </button>
      <button
        (click)="sampleActiveIndex = sampleActiveIndex + 1"
        [disabled]="sampleActiveIndex === samples.length - 1"
      >
        Next
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  samples: Sample[] = [
    { title: 'Basic', component: SampleBasicComponent },
    { title: 'Animate On Stream', component: SampleStreamComponent },
    { title: 'Shared Element', component: SampleSharedElementComponent },
  ];
  sampleActiveIndex = 0;
}

interface Sample {
  title: string;
  component: Type<unknown>;
}
