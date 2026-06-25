import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { CollectionStats } from './CollectionStats';

describe('CollectionStats', () => {
  it('renders each stat value with its label', () => {
    const html = renderToStaticMarkup(
      <CollectionStats
        stats={[
          { label: 'Requests', value: 30 },
          { label: 'Folders', value: 7 },
          { label: 'Environments', value: 3 }
        ]}
      />
    );
    expect(html).toContain('30');
    expect(html).toContain('Requests');
    expect(html).toContain('7');
    expect(html).toContain('Folders');
    expect(html).toContain('3');
    expect(html).toContain('Environments');
  });

  it('derives each stat card test id from the base testId', () => {
    const html = renderToStaticMarkup(
      <CollectionStats stats={[{ label: 'Requests', value: 30 }]} testId="custom-stats" />
    );
    expect(html).toContain('data-testid="custom-stats"');
    expect(html).toContain('data-testid="custom-stats-stat"');
    expect(html).toContain('data-testid="custom-stats-stat-value"');
  });

  it('falls back to a default testId when none is given', () => {
    const html = renderToStaticMarkup(<CollectionStats stats={[{ label: 'Requests', value: 30 }]} />);
    expect(html).toContain('data-testid="collection-stats"');
    expect(html).toContain('data-testid="collection-stats-stat"');
  });
});
