import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lpj-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    @for (route of routes; track route.path) { @if (route.path){
    <a [routerLink]="route.path">{{ route.path }}</a
    >} }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      padding: 24px;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  #router = inject(Router);
  readonly routes = this.#router.config;
}
