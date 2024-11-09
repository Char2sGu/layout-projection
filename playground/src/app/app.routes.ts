import { Routes } from '@angular/router';

import { CaseProjectionComponent } from './case-projection/case-projection.component';
import { CaseSameElementsAnimationComponent } from './case-same-elements-animation/case-same-elements-animation.component';

export const routes: Routes = [
  {
    path: 'case-projection',
    component: CaseProjectionComponent,
  },
  {
    path: 'case-same-elements-animation',
    component: CaseSameElementsAnimationComponent,
  },
];
