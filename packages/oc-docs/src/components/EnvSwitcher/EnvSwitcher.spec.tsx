import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import { createOpenCollectionStore } from '../../store/store';
import { setDocsCollection } from '../../store/slices/docs';
import { setActiveEnv } from '../../store/slices/env';
import { getByTestId } from '../../test-utils/dom';
import EnvSwitcher from './EnvSwitcher';

const collectionWith = (environments: Environment[]): OpenCollection => ({ config: { environments } });

const withEnvs = collectionWith([{ name: 'Dev' }, { name: 'Prod' }]);

const render = (
  collection: OpenCollection,
  configure?: (s: ReturnType<typeof createOpenCollectionStore>) => void,
  props?: { testId?: string }
) => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure?.(store);
  const root = parse(
    renderToStaticMarkup(
      <Provider store={store}>
        <EnvSwitcher {...props} />
      </Provider>
    )
  );
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('EnvSwitcher', () => {
  it('shows the active environment name in the trigger', () => {
    const trigger = getByTestId(render(withEnvs, (s) => s.dispatch(setActiveEnv('Prod'))), 'env-switcher');
    expect(trigger.text).toContain('Prod');
  });

  it('marks the trigger as an accessible menu button', () => {
    const trigger = getByTestId(render(withEnvs, (s) => s.dispatch(setActiveEnv('Prod'))), 'env-switcher');
    expect(trigger.getAttribute('aria-label')).toBe('Select environment');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('type')).toBe('button');
  });

  it('renders the trigger closed with no menu in the static markup', () => {
    const root = render(withEnvs, (s) => s.dispatch(setActiveEnv('Prod')));
    expect(getByTestId(root, 'env-switcher').getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('[role="menu"]')).toBeNull();
  });

  it('falls back to the first env when none is active yet', () => {
    expect(getByTestId(render(withEnvs), 'env-switcher').text).toContain('Dev');
  });

  it('resolves a stale stored env to the first env in the render', () => {
    const trigger = getByTestId(render(withEnvs, (s) => s.dispatch(setActiveEnv('Ghost'))), 'env-switcher');
    expect(trigger.text).toContain('Dev');
    expect(trigger.text).not.toContain('Ghost');
  });

  it('renders an empty state when there are no environments', () => {
    const trigger = getByTestId(render(collectionWith([])), 'env-switcher');
    expect(trigger.text).toContain('No environments');
    expect(trigger.classList.contains('env-switcher-trigger--empty')).toBe(true);
    expect(trigger.getAttribute('title')).toBeFalsy();
  });

  it('carries the empty modifier only when there are no environments', () => {
    const trigger = getByTestId(render(withEnvs), 'env-switcher');
    expect(trigger.classList.contains('env-switcher-trigger--empty')).toBe(false);
  });

  it('paints the trigger dot with the active env color', () => {
    const dot = getByTestId(
      render(collectionWith([{ name: 'Dev', color: '#ff0000' }]), (s) => s.dispatch(setActiveEnv('Dev'))),
      'env-switcher'
    ).querySelector('.environment-label-dot');
    expect(dot?.getAttribute('style')).toContain('#ff0000');
    expect(dot?.classList.contains('environment-label-dot--empty')).toBe(false);
  });

  it('exposes the full env name in the trigger title (truncation is CSS)', () => {
    const long = 'development-staging-area-testing-qa-automation-local-setup-1';
    const trigger = getByTestId(
      render(collectionWith([{ name: long }]), (s) => s.dispatch(setActiveEnv(long))),
      'env-switcher'
    );
    // The name renders in full in the DOM; the trigger button carries the full
    // name as its title (CSS clamps the visible width with an ellipsis).
    expect(trigger.text).toContain(long);
    expect(trigger.getAttribute('title')).toBe(long);
  });

  it('derives the root and trigger test ids from a custom testId', () => {
    const root = render(withEnvs, (s) => s.dispatch(setActiveEnv('Dev')), { testId: 'playground-env-switcher' });
    expect(getByTestId(root, 'playground-env-switcher-root')).toBeTruthy();
    expect(getByTestId(root, 'playground-env-switcher')).toBeTruthy();
  });
});
