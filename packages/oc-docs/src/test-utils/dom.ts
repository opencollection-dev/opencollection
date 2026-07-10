import type { HTMLElement } from 'node-html-parser';

export const query = (root: HTMLElement, selector: string): HTMLElement => {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`No element matches selector: ${selector}`);
  return el;
};
