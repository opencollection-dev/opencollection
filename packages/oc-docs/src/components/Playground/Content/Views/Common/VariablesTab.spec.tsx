import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../hooks/useRenderToDom';
import { query } from '../../../../../test-utils/dom';
import VariablesTab from './VariablesTab';

const noop = () => {};

describe('VariablesTab', () => {
  it('renders a typed variable value and its humanized data type', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'count', value: { type: 'number', data: '42' } }]} onVariablesChange={noop} />
    );
    expect(query(root, 'td.col-value input').getAttribute('value')).toBe('42');
    expect(query(root, 'td.col-type').text.trim()).toBe('Number');
  });

  it('leaves an untyped variable without a data-type label', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'host', value: 'localhost' }]} onVariablesChange={noop} />
    );
    expect(query(root, 'td.col-value input').getAttribute('value')).toBe('localhost');
    expect(query(root, 'td.col-type').text.trim()).toBe('');
  });
});
