import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { ElementMeasurer } from '@layout-projection/core';

@Directive({
  selector: '[lpjFixLayoutOnDestroy]',
  standalone: true,
})
export class FixLayoutOnDestroyDirective implements OnDestroy {
  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private measurer = inject(ElementMeasurer);

  ngOnDestroy(): void {
    const boundingBox = this.measurer.measureBoundingBox(this.element);
    this.element.style.position = 'fixed';
    this.element.style.top = `${boundingBox.top}px`;
    this.element.style.left = `${boundingBox.left}px`;
    this.element.style.width = `${boundingBox.width()}px`;
    this.element.style.height = `${boundingBox.height()}px`;
  }
}
