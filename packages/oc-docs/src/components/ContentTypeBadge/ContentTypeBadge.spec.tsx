import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ContentTypeBadge } from './ContentTypeBadge';

describe('ContentTypeBadge', () => {
  it('renders the label', () => {
    expect(renderToStaticMarkup(<ContentTypeBadge label="application/json" />)).toContain('application/json');
  });
});
