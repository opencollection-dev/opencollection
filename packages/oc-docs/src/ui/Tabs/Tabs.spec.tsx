import React from 'react';
import { describe, it, expect } from 'vitest';
import { Tabs, type Tab } from './Tabs';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';

const tabs: Tab[] = [
  { id: 'a', label: 'Alpha', count: 2, content: <p data-testid="alpha">alpha content</p> },
  { id: 'b', label: 'Beta', content: <p data-testid="beta">beta content</p> },
  { id: 'c', label: 'Gamma', count: 5, content: <p data-testid="gamma">gamma content</p> }
];

describe('Tabs', () => {
  it('renders an accessible tablist with a tab button per item', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    expect(root.querySelector('[role="tablist"]')).not.toBeNull();
    expect(root.querySelectorAll('[role="tab"]')).toHaveLength(3);
  });

  it('shows the label and its count', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    const tab = query(root, '[data-testid="t-tab-a"]');
    expect(tab.text).toContain('Alpha');
    expect(query(tab, '.tab-count').text).toBe('2');
  });

  it('activates the first tab by default and mounts only its panel', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    expect(query(root, '[data-testid="t-tab-a"]').getAttribute('aria-selected')).toBe('true');
    expect(query(root, '[data-testid="t-tab-b"]').getAttribute('aria-selected')).toBe('false');
    expect(root.querySelector('[data-testid="alpha"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="beta"]')).toBeNull();
  });

  it('honours a controlled activeTab', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} activeTab="c" testId="t" />);
    expect(query(root, '[data-testid="t-tab-c"]').getAttribute('aria-selected')).toBe('true');
    expect(root.querySelector('[data-testid="gamma"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="alpha"]')).toBeNull();
  });

  it('honours defaultActiveTab', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} defaultActiveTab="b" testId="t" />);
    expect(root.querySelector('[data-testid="beta"]')).not.toBeNull();
  });

  it('applies roving tabindex (only the active tab is tabbable)', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    expect(query(root, '[data-testid="t-tab-a"]').getAttribute('tabindex')).toBe('0');
    expect(query(root, '[data-testid="t-tab-b"]').getAttribute('tabindex')).toBe('-1');
  });

  it('renders the active tab’s rightElement, falling back to the shared one', () => {
    const withRight: Tab[] = [
      { id: 'a', label: 'A', content: <p>a</p>, rightElement: <span>a-right</span> },
      { id: 'b', label: 'B', content: <p>b</p> }
    ];
    const onA = useRenderToDom(<Tabs tabs={withRight} activeTab="a" rightElement={<span>shared</span>} />);
    expect(query(onA, '.tabs-right').text).toBe('a-right');

    const onB = useRenderToDom(<Tabs tabs={withRight} activeTab="b" rightElement={<span>shared</span>} />);
    expect(query(onB, '.tabs-right').text).toBe('shared');
  });

  it('wires each tab to its panel via aria-controls / aria-labelledby', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    const tab = query(root, '[data-testid="t-tab-a"]');
    const panel = query(root, '[role="tabpanel"]');
    expect(tab.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.getAttribute('id'));
  });

  it('uses the underline variant by default', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} testId="t" />);
    expect(query(root, '[data-testid="t"]').classList.contains('tabs-variant-underline')).toBe(true);
    expect(query(root, '[data-testid="t"]').classList.contains('tabs-variant-button')).toBe(false);
  });

  it('applies the button variant class when variant="button"', () => {
    const root = useRenderToDom(<Tabs tabs={tabs} variant="button" testId="t" />);
    expect(query(root, '[data-testid="t"]').classList.contains('tabs-variant-button')).toBe(true);
    expect(query(root, '[data-testid="t"]').classList.contains('tabs-variant-underline')).toBe(false);
  });
});
