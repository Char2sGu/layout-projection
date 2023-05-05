import { Injectable, Injector, Type } from '@angular/core';
import { createCustomElement, NgElement } from '@angular/elements';

@Injectable()
export class NgElementComponent {
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

export interface NgElementComponentType<Component extends NgElementComponent>
  extends Type<Component> {
  selector: string;
}

@Injectable({ providedIn: 'root' })
export class NgElementComponentInjector implements Injector {
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

@Injectable({ providedIn: 'root' })
export class NgElementQuerier {
  query<Component extends NgElementComponent>(
    root: HTMLElement,
    type: NgElementComponentType<Component>,
  ): (NgElement & Component) | null {
    return root.querySelector<NgElement & Component>(type.selector);
  }

  queryAll<Component extends NgElementComponent>(
    root: HTMLElement,
    type: NgElementComponentType<Component>,
  ): (NgElement & Component)[] {
    type Element = NgElement & Component;
    const elements = root.querySelectorAll<Element>(type.selector);
    return [...elements];
  }
}
