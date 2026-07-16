import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { getByTestId, queryByTestId } from '../../test-utils/dom';
import { InfoTip } from './InfoTip';

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('InfoTip', () => {
  it('renders an accessible trigger button labelled with its content', () => {
    const root = render(<InfoTip content="You can write any valid JS expression here" />);
    const trigger = getByTestId(root, 'infotip');
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.getAttribute('aria-label')).toBe('You can write any valid JS expression here');
    expect(trigger.querySelector('svg')).toBeTruthy();
  });

  it('honours a custom test id', () => {
    const root = render(<InfoTip content="Help" testId="expr-help" />);
    expect(queryByTestId(root, 'expr-help')).toBeTruthy();
    expect(queryByTestId(root, 'infotip')).toBeNull();
  });
});
