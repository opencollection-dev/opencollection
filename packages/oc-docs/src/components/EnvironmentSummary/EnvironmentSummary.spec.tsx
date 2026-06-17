import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummary } from './EnvironmentSummary';

const env = (name: string): Environment => ({ name, variables: [] });

describe('EnvironmentSummary', () => {
  it('renders nothing when there are no environments', () => {
    expect(renderToStaticMarkup(<EnvironmentSummary environments={[]} />)).toBe('');
  });

  it('renders an item for each environment', () => {
    const html = renderToStaticMarkup(
      <EnvironmentSummary environments={[env('Production'), env('Staging')]} />
    );
    expect(html).toContain('Production');
    expect(html).toContain('Staging');
  });
});
