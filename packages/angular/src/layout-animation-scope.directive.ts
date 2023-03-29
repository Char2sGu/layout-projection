import {
  Directive,
  Injectable,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Node, NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { NodeDirective } from './node.directive';

@Directive({
  selector: '[lpjAnimationScope]',
})
export class LayoutAnimationScopeDirective implements OnInit {
  @Input() set lpjAnimationScope(v: '' | this['source']) {
    if (v === '') return;
    this.source = v;
  }

  source?: LayoutAnimationScopeRef;

  constructor(
    private templateRef: TemplateRef<LayoutAnimationScopeTemplateContext>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    const injector = this.createInjector();
    const ref = injector.get(LayoutAnimationScopeRef);
    this.viewContainer.createEmbeddedView(
      this.templateRef,
      { $implicit: ref },
      { injector },
    );
  }

  private createInjector(): Injector {
    const {
      nodeRegistry = new LayoutAnimationScopeNodeRegistry(),
      entryRegistry = new LayoutAnimationScopeEntryRegistry(),
      snapshots = new NodeSnapshotMap(),
    } = this.source ?? {};

    const raw = Injector.create({
      parent: this.viewContainer.injector,
      providers: [
        { provide: LayoutAnimationScopeRef },
        { provide: LayoutAnimationScopeNodeRegistry, useValue: nodeRegistry },
        { provide: LayoutAnimationScopeEntryRegistry, useValue: entryRegistry },
        { provide: NodeSnapshotMap, useValue: snapshots },
      ],
    });

    // TODO: Remove this wrapper once https://github.com/angular/angular/issues/49621
    // is solved.
    // Currently, the custom injector specified for an embedded view would be
    // checked before node injectors, thus we need to forbid certain tokens
    // from being resolved from the custom injector so that these tokens would
    // be resolved from the node injectors.
    const tokens = [Node, NodeDirective];
    return {
      get(token: any, ...args: any[]): any {
        if (tokens.includes(token)) token = Symbol('not-found');
        return raw.get(token, ...args);
      },
    };
  }
}

@Injectable()
export class LayoutAnimationScopeRef {
  constructor(
    readonly nodeRegistry: LayoutAnimationScopeNodeRegistry,
    readonly entryRegistry: LayoutAnimationScopeEntryRegistry,
    readonly snapshots: NodeSnapshotMap,
  ) {}
}

export interface LayoutAnimationScopeTemplateContext {
  $implicit: LayoutAnimationScopeRef;
}

export class LayoutAnimationScopeNodeRegistry extends Set<Node> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}
