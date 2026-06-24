import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItem } from './EnvironmentSummaryItem';

const env = (name: string, variableCount: number): Environment => ({
  name,
  variables: Array.from({ length: variableCount }, (_, i) => ({ name: `var${i}`, value: '' }))
});

describe('EnvironmentSummaryItem', () => {
  it('renders the environment name', () => {
    const html = renderToStaticMarkup(<EnvironmentSummaryItem environment={env('Production', 3)} />);
    expect(html).toContain('Production');
  });

  it('pluralises the variable count', () => {
    expect(renderToStaticMarkup(<EnvironmentSummaryItem environment={env('A', 1)} />)).toContain('1 variable');
    expect(renderToStaticMarkup(<EnvironmentSummaryItem environment={env('B', 8)} />)).toContain('8 variables');
    expect(renderToStaticMarkup(<EnvironmentSummaryItem environment={env('C', 0)} />)).toContain('0 variables');
  });
});
