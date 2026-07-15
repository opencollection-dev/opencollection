import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { query } from '../../../../../../test-utils/dom';
import { VariablesTab } from './VariablesTab';

const noop = () => {};

const inputValues = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('input.text-input').map((input) => input.getAttribute('value'));

const sectionTitles = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('.vars-section-title').map((el) => el.text.trim());

describe('VariablesTab', () => {
  it('renders the Pre Request section with a variable name/value and a type dropdown', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'baseUrl', value: 'https://api.example.com' }]} onVariablesChange={noop} />
    );
    expect(sectionTitles(root)).toContain('Pre Request');
    const values = inputValues(root);
    expect(values).toContain('baseUrl');
    expect(values).toContain('https://api.example.com');
    expect(root.querySelector('.var-type-select')).toBeTruthy();
  });

  it('surfaces a typed value as its data string', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'count', value: { type: 'number', data: '42' } }]} onVariablesChange={noop} />
    );
    expect(inputValues(root)).toContain('42');
  });

  it('shows a warning when the value does not match the declared type', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'count', value: { type: 'number', data: 'abc' } }]} onVariablesChange={noop} />
    );
    expect(root.querySelector('.var-type-warning')).toBeTruthy();
  });

  it('shows no warning for a valid typed value', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'count', value: { type: 'number', data: '42' } }]} onVariablesChange={noop} />
    );
    expect(root.querySelector('.var-type-warning')).toBeNull();
  });

  it('flags a variable name with invalid characters', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'bad name', value: 'x' }]} onVariablesChange={noop} />
    );
    expect(query(root, '.cell-error').getAttribute('aria-label')).toContain('Variable contains invalid characters');
  });

  it('shows no error for a valid variable name', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'baseUrl', value: 'x' }]} onVariablesChange={noop} />
    );
    expect(root.querySelector('.cell-error')).toBeNull();
  });

  it('omits the Post Response section unless post-response props are given', () => {
    const root = useRenderToDom(<VariablesTab variables={[]} onVariablesChange={noop} />);
    expect(sectionTitles(root)).not.toContain('Post Response');
  });

  it('renders the Post Response section with an Expr header, help, and expression', () => {
    const root = useRenderToDom(
      <VariablesTab
        variables={[]}
        onVariablesChange={noop}
        postResponseVars={[{ name: 'token', expr: 'res.body.token' }]}
        onPostResponseVarsChange={noop}
        exprHelp="You can write any valid JS Template Literal here"
      />
    );
    expect(sectionTitles(root)).toContain('Post Response');
    expect(inputValues(root)).toContain('res.body.token');
    expect(root.querySelector('[data-testid="post-response-expr-help"]')).toBeTruthy();
  });

  it('renders a typed variable value and reflects its type in the type dropdown', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'count', value: { type: 'number', data: '42' } }]} onVariablesChange={noop} />
    );
    expect(query(root, 'td.col-value input').getAttribute('value')).toBe('42');
    expect(query(root, '.var-type-label').text.trim()).toBe('number');
  });

  it('defaults an untyped variable to the string type', () => {
    const root = useRenderToDom(
      <VariablesTab variables={[{ name: 'host', value: 'localhost' }]} onVariablesChange={noop} />
    );
    expect(query(root, 'td.col-value input').getAttribute('value')).toBe('localhost');
    expect(query(root, '.var-type-label').text.trim()).toBe('string');
  });
});
