import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '@store/store';
import { setDocsCollection } from '@slices/docs';
import { setActiveEnv } from '@slices/env';
import EnvSwitcher from './EnvSwitcher';

const withEnvs: any = { config: { environments: [{ name: 'Dev' }, { name: 'Prod' }] } };

const render = (collection: any, configure?: (s: ReturnType<typeof createOpenCollectionStore>) => void): string => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure?.(store);
  return renderToStaticMarkup(
    <Provider store={store}>
      <EnvSwitcher />
    </Provider>
  );
};

describe('EnvSwitcher', () => {
  it('shows the active environment name in the trigger', () => {
    const html = render(withEnvs, (s) => s.dispatch(setActiveEnv('Prod')));
    expect(html).toContain('Prod');
    expect(html).toContain('aria-label="Select environment"');
  });

  it('falls back to the first env when none is active yet', () => {
    expect(render(withEnvs)).toContain('Dev');
  });

  it('renders an empty state when there are no environments', () => {
    expect(render({ config: { environments: [] } })).toContain('No environment');
  });

  it('exposes the full env name in the trigger title (truncation is CSS)', () => {
    const long = 'development-staging-area-testing-qa-automation-local-setup-1';
    const html = render({ config: { environments: [{ name: long }] } }, (s) => s.dispatch(setActiveEnv(long)));
    // The name renders in full in the DOM; the trigger button carries the full
    // name as its title (CSS clamps the visible width with an ellipsis).
    expect(html).toContain(long);
    expect(html).toContain(`title="${long}"`);
  });
});
