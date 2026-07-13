import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { Popover } from './Popover';

describe('Popover', () => {
  it('renders the anchor and mounts no panel while closed (SSR-safe)', () => {
    const root = useRenderToDom(
      <Popover content={<div data-testid="panel">card body</div>}>
        <button data-testid="anchor">anchor</button>
      </Popover>
    );
    expect(root.querySelector('[data-testid="anchor"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="panel"]')).toBeNull();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });

  it('returns a non-element child unchanged without throwing', () => {
    const root = useRenderToDom(<Popover content={<div />}>{'plain text' as unknown as React.ReactElement}</Popover>);
    expect(root.text).toContain('plain text');
  });
});
