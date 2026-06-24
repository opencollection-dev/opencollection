import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Portal } from './Portal';

describe('Portal', () => {
  it('renders nothing during server-side rendering (defers until mounted)', () => {
    const html = renderToStaticMarkup(
      <Portal>
        <span>portaled content</span>
      </Portal>
    );
    expect(html).toBe('');
  });

  it('does not throw when rendered without a DOM', () => {
    expect(() => renderToStaticMarkup(<Portal>{null}</Portal>)).not.toThrow();
  });
});
