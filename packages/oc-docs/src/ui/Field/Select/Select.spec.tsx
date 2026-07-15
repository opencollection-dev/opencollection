import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';
import { query } from '../../../test-utils/dom';

const OPTIONS = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' }
];

const noop = () => {};

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('Select', () => {
  it('shows the label of the selected option and hides the native control', () => {
    const root = render(<Select value="b" options={OPTIONS} onChange={noop} />);
    expect(query(root, '.oc-select-label').text.trim()).toBe('Banana');
    expect(root.querySelector('.oc-select-native')).toBeTruthy();
  });

  it('renders every option and marks the current value as selected', () => {
    const root = render(<Select value="b" options={OPTIONS} onChange={noop} />);
    const native = query(root, '.oc-select-native');
    expect(native.querySelectorAll('option').map((o) => o.text.trim())).toEqual(['Apple', 'Banana']);
    expect(query(native, 'option[selected]').text.trim()).toBe('Banana');
  });

  it('forwards id, aria-label and test id to the native select', () => {
    const root = render(
      <Select value="a" options={OPTIONS} onChange={noop} id="my-select" ariaLabel="Fruit" testId="fruit-select" />
    );
    const native = query(root, '.oc-select-native');
    expect(native.getAttribute('id')).toBe('my-select');
    expect(native.getAttribute('aria-label')).toBe('Fruit');
    expect(native.getAttribute('data-testid')).toBe('fruit-select');
  });

  it('renders a caret icon', () => {
    const root = render(<Select value="a" options={OPTIONS} onChange={noop} />);
    expect(root.querySelector('.oc-select-caret svg')).toBeTruthy();
  });

  it('shows an empty label when the value matches no option', () => {
    const root = render(<Select value="z" options={OPTIONS} onChange={noop} />);
    expect(query(root, '.oc-select-label').text.trim()).toBe('');
  });
});
