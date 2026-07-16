import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';
import { DisabledBadge } from './DisabledBadge';

describe('DisabledBadge', () => {
  it('renders a "Disabled" chip', () => {
    const root = useRenderToDom(<DisabledBadge />);
    expect(query(root, '.disabled-badge').text.trim()).toBe('Disabled');
  });
});
