import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import { query } from '../../../test-utils/dom';

const noop = () => {};

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('Input', () => {
  it('renders a plain text input with value, placeholder, id and test id', () => {
    const root = render(<Input value="hello" onChange={noop} placeholder="Name" testId="my-input" id="my-input" />);
    const input = query(root, '.oc-input');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('value')).toBe('hello');
    expect(input.getAttribute('placeholder')).toBe('Name');
    expect(input.getAttribute('data-testid')).toBe('my-input');
    expect(input.getAttribute('id')).toBe('my-input');
  });

  it('honours a custom type and stays free of a reveal toggle', () => {
    const root = render(<Input value="7" type="number" onChange={noop} testId="n" />);
    expect(query(root, '.oc-input').getAttribute('type')).toBe('number');
    expect(root.querySelector('.oc-input-toggle')).toBeNull();
  });

  it('masks a secret value and exposes an accessible reveal toggle', () => {
    const root = render(<Input value="secret" onChange={noop} secret testId="my-secret" />);
    expect(query(root, '.oc-input-wrapper').classNames).toContain('oc-input-wrapper--secret');
    expect(query(root, '[data-testid="my-secret"]').getAttribute('type')).toBe('password');
    const toggle = query(root, '[data-testid="my-secret-toggle"]');
    expect(toggle.getAttribute('aria-label')).toBe('Show value');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });

  it('disables the input and its toggle', () => {
    const root = render(<Input value="" onChange={noop} secret disabled testId="d" />);
    expect(query(root, '[data-testid="d"]').hasAttribute('disabled')).toBe(true);
    expect(query(root, '[data-testid="d-toggle"]').hasAttribute('disabled')).toBe(true);
  });
});
