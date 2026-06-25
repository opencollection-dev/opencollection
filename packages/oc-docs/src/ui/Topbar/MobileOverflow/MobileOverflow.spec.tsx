import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import MobileOverflow from './MobileOverflow';

describe('MobileOverflow', () => {
  it('renders the trigger collapsed by default (popover hidden, slot not shown)', () => {
    const html = renderToStaticMarkup(
      <MobileOverflow>
        <div data-testid="env-switcher-slot" />
      </MobileOverflow>
    );
    expect(html).toContain('aria-label="More options"');
    expect(html).toContain('aria-expanded="false"');
    // Popover (and the relocated slot) only mount once opened.
    expect(html).not.toContain('data-testid="env-switcher-slot"');
  });
});
