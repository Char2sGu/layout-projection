import { Layout } from '@layout-projection/core';

export function paintLayout(layout: Layout, name?: string): HTMLElement {
  const box = document.createElement('div');

  if (name) box.setAttribute('name', name);
  box.style.position = 'fixed';
  box.style.border = '2px solid red';
  box.style.top = `${layout.top}px`;
  box.style.left = `${layout.left}px`;
  box.style.width = `${layout.right - layout.left}px`;
  box.style.height = `${layout.bottom - layout.top}px`;
  box.style.mixBlendMode = 'difference';
  box.style.pointerEvents = 'none';

  document.body.appendChild(box);

  return box;
}
