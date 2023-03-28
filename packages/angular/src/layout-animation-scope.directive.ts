import {
  Directive,
  Injectable,
  Injector,
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
  constructor(
    private templateRef: TemplateRef<LayoutAnimationScopeTemplateContext>,
    private viewContainer: ViewContainerRef,
    private injector: Injector,
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
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: LayoutAnimationScopeRef },
        {
          provide: LayoutAnimationScopeNodeRegistry,
          useValue: new LayoutAnimationScopeNodeRegistry(),
        },
        {
          provide: LayoutAnimationScopeEntryRegistry,
          useValue: new LayoutAnimationScopeEntryRegistry(),
        },
        {
          provide: NodeSnapshotMap,
          useValue: new NodeSnapshotMap(),
        },
      ],
    });
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
