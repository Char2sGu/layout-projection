import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AnimationCurve } from '../common/animation';

@Component({
  selector: 'lpj-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('route', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            animate(`210ms 90ms ${AnimationCurve.Deceleration}`),
            style({ opacity: 1 }),
          ],
          { optional: true },
        ),
        query(
          ':leave',
          [
            style({ opacity: 1 }),
            animate(`90ms ${AnimationCurve.Acceleration}`),
            style({ opacity: 0 }),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  host: {
    ['[@route]']: 'router.url',
  },
})
export class GuidesComponent {
  router = inject(Router);
}
