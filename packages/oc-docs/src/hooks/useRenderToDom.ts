import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import type { ReactElement } from 'react';

export const useRenderToDom = (ui: ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((node) => node.remove());
  return root;
};
