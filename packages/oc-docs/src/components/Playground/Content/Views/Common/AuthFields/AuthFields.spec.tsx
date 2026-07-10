import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { AuthField, AuthSelect, AuthCheckbox } from '.';

const noop = () => {};

describe('AuthField', () => {
  it('renders the label and the value inside a text input', () => {
    const root = useRenderToDom(
      <AuthField label="Username" value="john" placeholder="Enter username" onChange={noop} />
    );
    expect(root.querySelector('label')?.text.trim()).toBe('Username');
    const input = root.querySelector('input');
    expect(input?.getAttribute('value')).toBe('john');
    expect(input?.getAttribute('placeholder')).toBe('Enter username');
    expect(input?.getAttribute('type')).toBe('text');
  });
});

describe('AuthSelect', () => {
  it('renders the label and every option', () => {
    const options = [
      { value: 'header', label: 'Header' },
      { value: 'query', label: 'Query Params' }
    ];
    const root = useRenderToDom(<AuthSelect label="Add to" value="header" options={options} onChange={noop} />);
    expect(root.querySelector('label')?.text.trim()).toBe('Add to');
    const rendered = root.querySelectorAll('option');
    expect(rendered.map((option) => option.text.trim())).toEqual(['Header', 'Query Params']);
    expect(rendered.map((option) => option.getAttribute('value'))).toEqual(['header', 'query']);
  });
});

describe('AuthCheckbox', () => {
  it('renders the label next to a checkbox input', () => {
    const root = useRenderToDom(<AuthCheckbox label="Use PKCE" checked onChange={noop} />);
    expect(root.querySelector('label')?.text).toContain('Use PKCE');
    expect(root.querySelector('input')?.getAttribute('type')).toBe('checkbox');
  });
});
