import { Injectable, Injector } from '@angular/core';
import { createCustomElement, NgElement } from '@angular/elements';

@Injectable()
export class CustomElementComponent {
  static readonly selector: string;

  static initialize(injector: Injector): void {
    customElements.define(
      this.selector,
      createCustomElement(this, { injector }),
    );
  }

  static create(): NgElement {
    return document.createElement(this.selector) as NgElement;
  }
}
