import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { IntersectionObserverService as IntersectionEntriesObservable } from '@ng-web-apis/intersection-observer';
import { map, Observable } from 'rxjs';

import { CustomElementComponent } from '../shared/custom-element';
import { parseNumberStringInput } from '../shared/input';

@Component({
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IntersectionEntriesObservable],
})
export class HeadingComponent extends CustomElementComponent {
  static override readonly selector = 'md-heading';

  @HostBinding('class') get class(): string {
    const level = parseNumberStringInput(this.level);
    return `level-${level}`;
  }

  @Input() id?: string;
  @Input() level = '1';

  visibility$: Observable<boolean>;

  constructor(intersections$: IntersectionEntriesObservable) {
    super();
    this.visibility$ = intersections$.pipe(
      map(([entry]) => entry.isIntersecting),
    );
  }
}
