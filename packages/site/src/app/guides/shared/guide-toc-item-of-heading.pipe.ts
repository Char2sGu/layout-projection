import { Pipe, PipeTransform } from '@angular/core';

import { HeadingNgElement } from '../../markdown-elements/heading/heading.component';
import { GuideTocItem } from '../guide-toc/guide-toc.component';

@Pipe({
  name: 'guideTocItemOfHeading',
  pure: true,
})
export class GuideTocItemOfHeadingPipe implements PipeTransform {
  transform(
    heading: HeadingNgElement | null,
    items: GuideTocItem[],
  ): GuideTocItem | null {
    if (!heading) return null;
    return items.find((item) => item.id === heading.id) ?? null;
  }
}
