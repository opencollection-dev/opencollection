import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders its children when they do not throw', () => {
    const root = useRenderToDom(
      <ErrorBoundary>
        <span className="ok">fine</span>
      </ErrorBoundary>
    );
    expect(query(root, '.ok').text).toBe('fine');
  });

  it('flags an error via getDerivedStateFromError', () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({ hasError: true });
  });
});
