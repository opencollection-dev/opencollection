import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '@hooks/useRenderToDom';
import { query } from '../../../../../../test-utils/dom';
import { VariablesTab } from './VariablesTab';

const noop = () => {};

const inputValues = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('input.text-input').map((input) => input.getAttribute('value'));

describe('VariablesTab', () => {
  it('renders the default title and a variable name/value', () => {
    const root = useRenderToDom(
      <VariablesTab
        variables={[{ name: 'baseUrl', value: 'https://api.example.com' }]}
        onVariablesChange={noop}
      />
    );
    expect(query(root, '.title').text.trim()).toBe('Variables');
    const values = inputValues(root);
    expect(values).toContain('baseUrl');
    expect(values).toContain('https://api.example.com');
  });

  it('renders a custom title and description', () => {
    const root = useRenderToDom(
      <VariablesTab
        variables={[]}
        onVariablesChange={noop}
        title="Runtime Variables"
        description="These override collection values"
      />
    );
    expect(query(root, '.title').text.trim()).toBe('Runtime Variables');
    expect(query(root, '.description').text.trim()).toBe('These override collection values');
  });

  it('stringifies a typed (non-string) value instead of leaving it blank', () => {
    const root = useRenderToDom(
      <VariablesTab
        variables={[{ name: 'timeout', value: 42 }]}
        onVariablesChange={noop}
      />
    );
    const values = inputValues(root);
    expect(values).toContain('timeout');
    expect(values).toContain('42');
  });
});
