import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '@store/store';
import { setShowVars } from '@slices/env';
import ShowVarsToggle from './ShowVarsToggle';

const render = (configure?: (s: ReturnType<typeof createOpenCollectionStore>) => void): string => {
  const store = createOpenCollectionStore();
  configure?.(store);
  return renderToStaticMarkup(
    <Provider store={store}>
      <ShowVarsToggle />
    </Provider>
  );
};

describe('ShowVarsToggle', () => {
  it('renders a switch with the "Show vars" label, unchecked by default', () => {
    const html = render();
    expect(html).toContain('role="switch"');
    expect(html).toContain('Show vars');
    expect(html).toContain('aria-checked="false"');
  });

  it('reflects the showVars flag via aria-checked', () => {
    expect(render((s) => s.dispatch(setShowVars(true)))).toContain('aria-checked="true"');
  });
});
