import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { BoundingBox } from '@layout-projection/core';

@Directive({
  selector: '[lpjFixLayoutOnDestroy]',
  standalone: true,
})
export class FixLayoutOnDestroyDirective implements OnDestroy {
  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  ngOnDestroy(): void {
    const boundingBox = BoundingBox.from(this.element);

    // TODO: safer parsing
    const styles = getComputedStyle(this.element);
    let leftOffset = parseFloat(styles.marginLeft);
    if (isNaN(leftOffset)) leftOffset = 0;
    let topOffset = parseFloat(styles.marginTop);
    if (isNaN(topOffset)) topOffset = 0;

    this.element.style.position = 'fixed';
    this.element.style.marginLeft = `${leftOffset}px`;
    this.element.style.marginTop = `${topOffset}px`;
    this.element.style.top = `${boundingBox.top - topOffset}px`;
    this.element.style.left = `${boundingBox.left - leftOffset}px`;
    this.element.style.width = `${boundingBox.width()}px`;
    this.element.style.height = `${boundingBox.height()}px`;
  }
}
