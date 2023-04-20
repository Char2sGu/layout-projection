import {
  EventEmitter,
  inject,
  Injectable,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { createCustomElement, NgElement } from '@angular/elements';

@Injectable()
export class CustomElementComponent implements OnInit, OnDestroy {
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

  protected registry = inject(CustomElementComponentRegistry);

  ngOnInit(): void {
    this.registry.add(this);
  }

  ngOnDestroy(): void {
    this.registry.delete(this);
  }
}

@Injectable({ providedIn: 'root' })
export class CustomElementComponentRegistry extends Set<CustomElementComponent> {
  update$ = new EventEmitter();

  override add(value: CustomElementComponent): this {
    super.add(value);
    this.update$.emit();
    return this;
  }

  override delete(value: CustomElementComponent): boolean {
    const result = super.delete(value);
    this.update$.emit();
    return result;
  }
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
