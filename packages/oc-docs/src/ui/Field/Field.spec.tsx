import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { Field } from './Field';
import { query } from '../../test-utils/dom';

const noop = () => {};

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('Field', () => {
  it('stacks a label above an Input control and associates them', () => {
    const root = render(
      <Field label="Username" htmlFor="auth-field-username">
        <Field.Input id="auth-field-username" testId="auth-username" value="admin" onChange={noop} />
      </Field>
    );
    const label = query(root, '.oc-field .oc-label');
    expect(label.text.trim()).toBe('Username');
    expect(label.getAttribute('for')).toBe('auth-field-username');
    expect(query(root, '.oc-field .oc-input').getAttribute('data-testid')).toBe('auth-username');
  });

  it('exposes Select through the compound namespace', () => {
    const root = render(
      <Field label="Add To" htmlFor="p">
        <Field.Select
          id="p"
          testId="placement"
          value="header"
          options={[
            { value: 'header', label: 'Header' },
            { value: 'query', label: 'Query Params' }
          ]}
          onChange={noop}
        />
      </Field>
    );
    expect(query(root, '.oc-field .oc-select').getAttribute('data-testid')).toBe('placement');
  });

  it('renders without a label when none is given', () => {
    const root = render(
      <Field>
        <Field.Input value="" onChange={noop} />
      </Field>
    );
    expect(root.querySelector('.oc-label')).toBeNull();
  });
});
