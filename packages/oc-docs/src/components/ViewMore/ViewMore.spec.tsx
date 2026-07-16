import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';
import { ViewMore } from './ViewMore';

describe('ViewMore', () => {
  it('renders its children and shows no toggle until overflow is measured on the client', () => {
    const root = useRenderToDom(
      <ViewMore testId="vm">
        <p>Body content</p>
      </ViewMore>
    );
    expect(query(root, '.view-more-content').text).toContain('Body content');
    expect(root.querySelector('[data-testid="vm-toggle"]')).toBeNull();
  });
});
