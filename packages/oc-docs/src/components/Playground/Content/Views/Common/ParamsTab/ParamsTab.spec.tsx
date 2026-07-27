import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { ParamsTab } from './ParamsTab';

const noop = () => {};

const columnLabels = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('thead th').map((th) => th.text.trim());

describe('ParamsTab — descriptions', () => {
  it('shows a Description column with authored query-param descriptions', () => {
    const root = useRenderToDom(
      <ParamsTab
        params={[{ name: 'page', value: '1', type: 'query', description: 'Page number, 1-based' }]}
        onParamsChange={noop}
      />
    );
    expect(columnLabels(root)).toContain('Description');
    expect(root.text).toContain('Page number, 1-based');
  });

  it('normalizes an object-form ({content}) param description to its text', () => {
    const root = useRenderToDom(
      <ParamsTab
        params={[{ name: 'q', value: 'cats', type: 'query', description: { content: 'Search query', type: 'text' } }]}
        onParamsChange={noop}
      />
    );
    expect(root.text).toContain('Search query');
  });
});
