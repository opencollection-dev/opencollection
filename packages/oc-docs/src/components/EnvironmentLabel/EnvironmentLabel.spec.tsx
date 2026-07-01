import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { EnvironmentLabel } from './EnvironmentLabel';

describe('EnvironmentLabel', () => {
  it('renders the environment name and a color dot', () => {
    const root = useRenderToDom(<EnvironmentLabel name="Development" />);
    expect(root.querySelector('.environment-label-name')?.text.trim()).toBe('Development');
    expect(root.querySelector('.environment-label-dot')).toBeTruthy();
  });

  it('applies the environment color to the dot', () => {
    const root = useRenderToDom(<EnvironmentLabel name="Prod" color="#dc2626" />);
    expect(root.querySelector('.environment-label-dot')?.getAttribute('style')).toContain('#dc2626');
  });

  it('forwards custom class names to the root and the name', () => {
    const root = useRenderToDom(
      <EnvironmentLabel name="Staging" className="env-tab" nameClassName="env-tab-name" />
    );
    expect(root.querySelector('.environment-label.env-tab')).toBeTruthy();
    expect(root.querySelector('.environment-label-name.env-tab-name')).toBeTruthy();
  });
});
