import {
  Directive,
  Injectable,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  ProjectionNode,
  ProjectionNodeSnapshotMap,
} from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { MapExpirer } from './shared/map';

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
      snapshots = new ProjectionNodeSnapshotMap(),
    } = this.source ?? {};
    return Injector.create({
      providers: [
        { provide: LayoutAnimationScopeRef },
        { provide: LayoutAnimationScopeNodeRegistry, useValue: nodeRegistry },
        { provide: LayoutAnimationScopeEntryRegistry, useValue: entryRegistry },
        { provide: ProjectionNodeSnapshotMap, useValue: snapshots },
        { provide: ProjectionNodeSnapshotMapExpirer },
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

export interface LayoutAnimationScopeTemplateContext {
  $implicit: LayoutAnimationScopeRef;
}

@Injectable()
export class LayoutAnimationScopeRef {
  constructor(
    readonly nodeRegistry: LayoutAnimationScopeNodeRegistry,
    readonly entryRegistry: LayoutAnimationScopeEntryRegistry,
    readonly snapshots: ProjectionNodeSnapshotMap,
  ) {}
}

export class LayoutAnimationScopeNodeRegistry extends Set<ProjectionNode> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}

@Injectable()
export class ProjectionNodeSnapshotMapExpirer extends MapExpirer<
  ProjectionNode['id']
> {
  constructor(map: ProjectionNodeSnapshotMap) {
    super(map, 10);
  }
}
