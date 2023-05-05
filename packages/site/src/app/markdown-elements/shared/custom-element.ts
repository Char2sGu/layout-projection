import { Injectable, Injector, Type } from '@angular/core';
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

export interface CustomElementComponentType<
  Component extends CustomElementComponent,
> extends Type<Component> {
  selector: string;
}

@Injectable({ providedIn: 'root' })
export class CustomElementComponentInjector implements Injector {
  private underlying?: Injector;

  constructor(private root: Injector) {}

  use(injector?: Injector): void {
    if (injector && this.underlying) throw new Error('Injector already set');
    this.underlying = injector;
  }

  get(...args: any[]): any {
    const injector = this.underlying ?? this.root;
    return injector.get.bind(injector, ...args)();
  }
}
