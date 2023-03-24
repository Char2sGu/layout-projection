import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, skip } from 'rxjs';

@Component({
  selector: 'app-sample-tabs',
  template: `
    <div class="container">
      <div class="tabs" lpjAnimationScope>
        <ng-container
          *lpjAnimationTrigger="tabActive$; for: ['overlay', 'underline']"
        ></ng-container>
        <div
          class="tab"
          [class.active]="tabActive$.value === tab"
          *ngFor="let tab of tabs"
          (click)="tabActive$.next(tab)"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <ng-container *ngIf="tabActive$.value === tab">
            <div
              class="tab-overlay"
              lpjNode="overlay"
              [lpjAnimation]="{ duration: 450 }"
            ></div>
            <div
              class="tab-underline"
              lpjNode="underline"
              [lpjAnimation]="{ duration: 225 }"
            ></div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background-color: rgb(136, 85, 255);
      }

      .container {
        width: 400px;
        height: 300px;
        background-color: white;
        border-radius: 10px;
      }

      .tabs {
        display: flex;
        padding: 4px;
      }

      .tab {
        position: relative;
        display: flex;
        height: 50px;
        padding: 0 30px;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        background-color: white;
        cursor: pointer;
      }

      .tab-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 5%);
        border-radius: inherit;
        z-index: 1;
      }

      .tab-underline {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 1px solid rgb(136, 85, 255);
        z-index: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleTabsComponent {
  tabs: Tab[] = [{ title: 'Apple' }, { title: 'Banana' }, { title: 'Orange' }];
  tabActive$ = new BehaviorSubject(this.tabs[0]);
  tabActiveChange$ = this.tabActive$.pipe(skip(1));
}

interface Tab {
  title: string;
}
