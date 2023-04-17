import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDocCodeModule } from '@taiga-ui/addon-doc';
import { TuiLinkModule, TuiNotificationModule } from '@taiga-ui/core';

import { CodeblockComponent } from './codeblock/codeblock.component';
import { LinkComponent } from './link/link.component';
import { MarkdownElementsRenderer } from './markdown-elements.renderer';
import { NotificationComponent } from './notification/notification.component';

const COMPONENTS = [CodeblockComponent, LinkComponent, NotificationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    TuiDocCodeModule,
    TuiNotificationModule,
    TuiLinkModule,
  ],
  providers: [MarkdownElementsRenderer],
})
export class MarkdownElementsModule {
  constructor(injector: Injector) {
    COMPONENTS.forEach((c) => c.initialize(injector));
  }
}
