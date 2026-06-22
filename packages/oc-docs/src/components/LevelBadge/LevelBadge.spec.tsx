import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { LevelBadge } from './LevelBadge';

describe('LevelBadge', () => {
  it('renders the level label', () => {
    expect(renderToStaticMarkup(<LevelBadge level="folder" />)).toContain('folder');
    expect(renderToStaticMarkup(<LevelBadge level="request" />)).toContain('request');
  });
});
