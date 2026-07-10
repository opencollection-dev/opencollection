import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import OverviewTab from './OverviewTab';

describe('OverviewTab', () => {
  it('renders markdown docs as HTML inside the markdown-documentation container', () => {
    const root = useRenderToDom(<OverviewTab docs="# Hi" />);
    const container = root.querySelector('[data-testid="overview-markdown-documentation"]');

    expect(container).toBeTruthy();
    expect(container?.getAttribute('class')).toContain('markdown-documentation');
    expect(container?.text).toContain('Hi');
    expect(container?.querySelector('h1')).toBeTruthy();
    expect(container?.querySelector('.heading-1')).toBeTruthy();
  });

  it('falls back to the empty message when no docs are provided', () => {
    const root = useRenderToDom(<OverviewTab />);
    expect(root.querySelector('[data-testid="overview-markdown-documentation"]')?.text.trim()).toBe(
      'No documentation found.'
    );
  });
});
