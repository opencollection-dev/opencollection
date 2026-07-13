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
});
