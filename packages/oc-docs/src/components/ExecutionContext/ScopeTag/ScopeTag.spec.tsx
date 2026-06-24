import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ScopeTag } from './ScopeTag';

describe('ScopeTag', () => {
  it('shows the scope name as the pill label', () => {
    expect(renderToStaticMarkup(<ScopeTag scope="request" />)).toContain('request');
  });

  it('adds a scope-specific modifier class so each scope can be tinted differently', () => {
    expect(renderToStaticMarkup(<ScopeTag scope="request" />)).toContain('scope-tag--request');
    expect(renderToStaticMarkup(<ScopeTag scope="folder" />)).toContain('scope-tag--folder');
    expect(renderToStaticMarkup(<ScopeTag scope="collection" />)).toContain('scope-tag--collection');
  });
});
