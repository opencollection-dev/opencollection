import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import type { Assertion } from '@opencollection/types/common/assertions';
import { AssertsTab } from './AssertsTab';
import { getByTestId } from '../../../../../../test-utils/dom';

const noop = () => {};

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('AssertsTab', () => {
  it('defaults the operator trigger to the first operator when a row has none', () => {
    const root = render(
      <AssertsTab assertions={[{ expression: 'res.status', value: '200' } as Assertion]} onAssertionsChange={noop} />
    );
    expect(getByTestId(root, 'assertion-operator-0').text).toContain('equals');
  });

  it('shows the stored operator label when one is set', () => {
    const root = render(
      <AssertsTab
        assertions={[{ expression: 'res.status', operator: 'gt', value: '1' } as Assertion]}
        onAssertionsChange={noop}
      />
    );
    expect(getByTestId(root, 'assertion-operator-0').text).toContain('greater than');
  });
});
