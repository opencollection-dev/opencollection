import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { getByTestId, queryByTestId } from '../../../../../../test-utils/dom';
import OverviewTab from './OverviewTab';

describe('OverviewTab', () => {
  it('renders markdown docs as HTML inside the markdown-documentation container', () => {
    const root = useRenderToDom(<OverviewTab docs="# Hi" />);
    const container = getByTestId(root, 'overview-markdown-documentation');

    expect(container.getAttribute('class')).toContain('markdown-documentation');
    expect(container.text).toContain('Hi');
    expect(container.querySelector('h1')).toBeTruthy();
    expect(container.querySelector('.heading-1')).toBeTruthy();
  });

  it('shows the empty state when no docs are provided', () => {
    const root = useRenderToDom(<OverviewTab />);
    expect(queryByTestId(root, 'overview-markdown-documentation')).toBeNull();
    expect(queryByTestId(root, 'overview-empty')).toBeTruthy();
    expect(getByTestId(root, 'overview-empty-heading').text).toContain('No overview content yet');
  });
});
