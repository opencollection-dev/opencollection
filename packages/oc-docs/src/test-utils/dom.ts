import type { HTMLElement } from 'node-html-parser';

export const query = (root: HTMLElement, selector: string): HTMLElement => {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`No element matches selector: ${selector}`);
  return el;
};

// Returns the element with the given data-testid, throwing if absent.
export const getByTestId = (root: HTMLElement, testId: string): HTMLElement =>
  query(root, `[data-testid="${testId}"]`);

// Returns the element with the given data-testid, or null if absent.
export const queryByTestId = (root: HTMLElement, testId: string): HTMLElement | null =>
  root.querySelector(`[data-testid="${testId}"]`);
