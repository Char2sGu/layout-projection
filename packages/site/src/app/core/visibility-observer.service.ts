import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisibilityObserver {
  observe(element: HTMLElement): Observable<boolean> {
    return new Observable((subscriber) => {
      const observer = new IntersectionObserver(([entry]) =>
        subscriber.next(entry.isIntersecting),
      );
      observer.observe(element);
      return () => observer.disconnect();
    });
  }
}
