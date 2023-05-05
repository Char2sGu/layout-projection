import { Pipe, PipeTransform } from '@angular/core';

import { HeadingNgElement } from '../../markdown-elements/heading/heading.component';
import { GuideTocItem } from '../guide-toc/guide-toc.component';

@Pipe({
  name: 'guideTocItemsFromHeadings',
  pure: true,
})
export class GuideTocItemsFromHeadingsPipe implements PipeTransform {
  transform(headings: HeadingNgElement[] | null): GuideTocItem[] | null {
    if (!headings) return null;
    return headings.map((h) => ({
      id: h.id,
      title: h.innerText,
      level: +h.level,
    }));
  }
}
