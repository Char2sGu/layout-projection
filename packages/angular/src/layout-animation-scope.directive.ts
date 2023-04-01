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
    return Injector.create({
      providers: [
        { provide: LayoutAnimationScopeRef },
        { provide: LayoutAnimationScopeNodeRegistry, useValue: nodeRegistry },
        { provide: LayoutAnimationScopeEntryRegistry, useValue: entryRegistry },
        { provide: NodeSnapshotMap, useValue: snapshots },
      ],
    });
  }

  static ngTemplateContextGuard(
    instance: LayoutAnimationScopeDirective,
    context: unknown,
  ): context is LayoutAnimationScopeTemplateContext {
    return true;
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
