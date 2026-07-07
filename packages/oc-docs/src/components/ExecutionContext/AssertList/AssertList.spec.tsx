import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { AssertList } from './AssertList';
import type { AssertionRow } from '../../../utils/assertions';

const binary: AssertionRow = { level: 'request', expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false };
const unary: AssertionRow = { level: 'collection', expression: 'res.body.token', operatorLabel: 'is defined', isUnary: true };
const disabled: AssertionRow = { level: 'request', expression: 'res.time', operatorLabel: 'less than', value: '500', isUnary: false, disabled: true };

describe('AssertList', () => {
  it('renders nothing when there are no assertions', () => {
    expect(renderToStaticMarkup(<AssertList assertions={[]} />)).toBe('');
  });

  it('shows each assertion as scope + expression + operator + value', () => {
    const html = renderToStaticMarkup(<AssertList assertions={[binary]} />);
    expect(html).toContain('request'); // the scope pill
    expect(html).toContain('res.status');
    expect(html).toContain('equals');
    expect(html).toContain('200');
  });

  it('omits the value for a unary operator like "is defined"', () => {
    const html = renderToStaticMarkup(<AssertList assertions={[unary]} />);
    expect(html).toContain('res.body.token');
    expect(html).toContain('is defined');
  });

  it('marks a disabled assertion with the is-disabled class', () => {
    expect(renderToStaticMarkup(<AssertList assertions={[disabled]} />)).toContain('is-disabled');
  });

  it('shows the assertion description beneath the expression when present', () => {
    const described: AssertionRow = { ...binary, description: 'Status must be OK' };
    const html = renderToStaticMarkup(<AssertList assertions={[described]} />);
    expect(html).toContain('Status must be OK');
    expect(html).toContain('oc-description');
  });
});
