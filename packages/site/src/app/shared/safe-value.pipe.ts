import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'safeValue',
  standalone: true,
  pure: true,
})
export class SafeValuePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string, type: 'url'): SafeValue {
    switch (type) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
  }
}
