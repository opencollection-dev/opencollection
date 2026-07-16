import type { HTMLElement } from 'node-html-parser';

export const query = (root: HTMLElement, selector: string): HTMLElement => {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`No element matches selector: ${selector}`);
  return el;
};

/** Find an element by its `data-testid`, throwing if it is absent. */
export const getByTestId = (root: HTMLElement, testId: string): HTMLElement => query(root, `[data-testid="${testId}"]`);

/** Find an element by its `data-testid`, or `null` when absent. */
export const queryByTestId = (root: HTMLElement, testId: string): HTMLElement | null =>
  root.querySelector(`[data-testid="${testId}"]`);
