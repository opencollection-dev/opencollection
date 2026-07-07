import React from 'react';
import { describe, it, expect } from 'vitest';
import { Description } from './Description';
import { useRenderToDom } from '../../hooks/useRenderToDom';

describe('Description', () => {
  it('renders a truncatable, tooltip-anchored line with the text', () => {
    const root = useRenderToDom(<Description text="API base URL" />);
    const el = root.querySelector('.oc-description.oc-truncate');
    expect(el).not.toBeNull();
    expect(el!.text.trim()).toBe('API base URL');
  });

  it('renders nothing for missing, empty, or whitespace-only text', () => {
    expect(useRenderToDom(<Description />).querySelector('.oc-description')).toBeNull();
    expect(useRenderToDom(<Description text="" />).querySelector('.oc-description')).toBeNull();
    expect(useRenderToDom(<Description text="   " />).querySelector('.oc-description')).toBeNull();
  });
});
