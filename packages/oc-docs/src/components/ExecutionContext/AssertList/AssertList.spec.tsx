import React from 'react';
import { describe, it, expect } from 'vitest';
import { AssertList } from './AssertList';
import { useRenderToDom } from '@hooks/useRenderToDom';
import type { AssertionRow } from '@utils/assertions';

const binary: AssertionRow = { level: 'request', expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false, description: 'Status must be OK' };
const unary: AssertionRow = { level: 'collection', expression: 'res.body.token', operatorLabel: 'is defined', isUnary: true };
const disabled: AssertionRow = { level: 'request', expression: 'res.time', operatorLabel: 'less than', value: '500', isUnary: false, disabled: true };

describe('AssertList', () => {
  it('renders nothing when there are no assertions', () => {
    expect(useRenderToDom(<AssertList assertions={[]} />).querySelector('.assert-item')).toBeNull();
  });

  it('shows each assertion as scope + expression + operator + value, with its description beneath', () => {
    const root = useRenderToDom(<AssertList assertions={[binary]} />);
    expect(root.querySelector('.scope-tag')?.text.trim()).toBe('request');
    expect(root.querySelector('.assert-expr')?.text.trim()).toBe('res.status equals 200');
    expect(root.querySelector('.description')?.text.trim()).toBe('Status must be OK');
  });

  it('omits the value for a unary operator like "is defined"', () => {
    const root = useRenderToDom(<AssertList assertions={[unary]} />);
    expect(root.querySelector('.assert-expr')?.text.trim()).toBe('res.body.token is defined');
  });

  it('marks a disabled assertion with the is-disabled class', () => {
    const root = useRenderToDom(<AssertList assertions={[disabled]} />);
    expect(root.querySelector('.assert-item.is-disabled')).not.toBeNull();
  });
});
