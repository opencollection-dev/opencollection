import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { getByTestId } from '../../test-utils/dom';
import Checkbox from './Checkbox';

const noop = () => {};

describe('Checkbox', () => {
  it('renders a checkbox input carrying the aria-label', () => {
    const root = useRenderToDom(<Checkbox testId="cb" checked={false} ariaLabel="Enable host" onChange={noop} />);
    const input = getByTestId(root, 'cb-input');
    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.getAttribute('aria-label')).toBe('Enable host');
  });

  it('reflects the checked prop on the input', () => {
    const checked = useRenderToDom(<Checkbox testId="cb" checked ariaLabel="Enable host" onChange={noop} />);
    expect(getByTestId(checked, 'cb-input').hasAttribute('checked')).toBe(true);

    const unchecked = useRenderToDom(<Checkbox testId="cb" checked={false} ariaLabel="Enable host" onChange={noop} />);
    expect(getByTestId(unchecked, 'cb-input').hasAttribute('checked')).toBe(false);
  });

  it('applies the provided className to the wrapper', () => {
    const root = useRenderToDom(<Checkbox testId="cb" className="enabled" checked ariaLabel="Enable host" onChange={noop} />);
    expect(getByTestId(root, 'cb').classList.contains('enabled')).toBe(true);
  });
});
