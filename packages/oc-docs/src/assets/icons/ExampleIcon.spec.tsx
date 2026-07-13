import React from 'react';
import { describe, it, expect } from 'vitest';
import { ExampleIcon } from './ExampleIcon';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';

describe('ExampleIcon', () => {
  it('renders a decorative svg glyph', () => {
    const root = useRenderToDom(<ExampleIcon />);
    expect(query(root, 'svg').getAttribute('aria-hidden')).toBe('true');
  });
});
