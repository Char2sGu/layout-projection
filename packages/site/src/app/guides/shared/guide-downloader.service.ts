import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { GuideRecord } from './guide.models';

@Injectable({ providedIn: 'root' })
export class GuideDownloader {
  private httpClient = inject(HttpClient);
  private cache = new Map<string, string>();

  download(record: GuideRecord): Observable<string> {
    const url = `assets/docs/${record.path}.md`;
    const cache = this.cache.get(url);
    return cache
      ? of(cache)
      : this.httpClient
          .get(url, { responseType: 'text' })
          .pipe(tap((content) => this.cache.set(url, content)));
  }
}
