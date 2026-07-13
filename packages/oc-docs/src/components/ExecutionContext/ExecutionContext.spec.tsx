import React from 'react';
import { describe, it, expect } from 'vitest';
import { ExecutionContext } from './ExecutionContext';
import { useRenderToDom } from '@hooks/useRenderToDom';
import { query } from '../../test-utils/dom';
import type { ScriptChainStep } from '@utils/request';
import type { AssertionRow } from '@utils/assertions';
import type { TestRow, RawTestScript } from '@utils/fileUtils';

const scriptChain: ScriptChainStep[] = [
  { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', sourceName: 'API', code: 'bru.setVar("x", 1)', order: 0 },
  { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'console.log("go")', order: 1 },
  { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'console.log("done")', order: 1 }
];

const assertions: AssertionRow[] = [
  { level: 'request', expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false },
  { level: 'request', expression: 'res.body.token', operatorLabel: 'is defined', isUnary: true }
];

const tests: TestRow[] = [
  { level: 'collection', name: 'is authenticated', sourceName: 'API', code: "test('is authenticated', () => {})" },
  { level: 'request', name: 'returns a token', code: "test('returns a token', () => {})" }
];

const testScripts: RawTestScript[] = [
  { level: 'collection', sourceName: 'API', code: "test('is authenticated', () => {})" },
  { level: 'request', code: "test('returns a token', () => {})" }
];

const full = (props: Partial<React.ComponentProps<typeof ExecutionContext>> = {}) => (
  <ExecutionContext
    scriptChain={scriptChain}
    preVars={[{ name: 'token', value: '{{authToken}}' }]}
    postVars={[{ name: 'sessionId', expression: 'res.body.id', scope: 'runtime' }]}
    assertions={assertions}
    tests={tests}
    testScripts={testScripts}
    {...props}
  />
);

const tabSelector = (id: string) => `[data-testid="execution-context-tabs-tab-${id}"]`;
const panelSelector = (id: string) => `[data-testid="execution-context-${id}"]`;
const flowSelector = '[data-testid="execution-context-flow"]';

describe('ExecutionContext', () => {
  describe('tabs variant (default)', () => {
    it('renders a tab per non-empty section, each with its item count', () => {
      const root = useRenderToDom(full());
      expect(query(query(root, tabSelector('variables')), '.tab-count').text).toBe('2');
      expect(query(query(root, tabSelector('scripts')), '.tab-count').text).toBe('3');
      expect(query(query(root, tabSelector('asserts')), '.tab-count').text).toBe('2');
      expect(query(query(root, tabSelector('tests')), '.tab-count').text).toBe('2');
    });

    it('mounts only the active tab panel (Variables first)', () => {
      const root = useRenderToDom(full());
      expect(query(root, panelSelector('variables')).text).toContain('sessionId');
      expect(root.querySelector(panelSelector('scripts'))).toBeNull();
      expect(root.querySelector(panelSelector('asserts'))).toBeNull();
      expect(root.querySelector(panelSelector('tests'))).toBeNull();
    });

    it('hides tabs that have no items', () => {
      const root = useRenderToDom(
        <ExecutionContext
          scriptChain={scriptChain}
          preVars={[{ name: 'token', value: 'x' }]}
          postVars={[]}
          assertions={[]}
          tests={[]}
        />
      );
      expect(root.querySelector(tabSelector('variables'))).not.toBeNull();
      expect(root.querySelector(tabSelector('scripts'))).not.toBeNull();
      expect(root.querySelector(tabSelector('asserts'))).toBeNull();
      expect(root.querySelector(tabSelector('tests'))).toBeNull();
    });

    it('shows the execution-flow indicator only while the Scripts tab is active', () => {
      expect(useRenderToDom(full()).querySelector(flowSelector)).toBeNull();

      const scriptsOnly = useRenderToDom(
        <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
      );
      expect(query(scriptsOnly, flowSelector).text).toBe('Sandwich execution flow');

      const sequential = useRenderToDom(
        <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} flow="sequential" />
      );
      expect(query(sequential, flowSelector).text).toBe('Sequential execution flow');
    });

    it('shows "View complete code" in the header only while the Tests tab is active', () => {
      const testsOnly = useRenderToDom(
        <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={tests} testScripts={testScripts} />
      );
      expect(testsOnly.querySelector('[data-testid="execution-context-view-complete-code"]')).not.toBeNull();
      expect(useRenderToDom(full()).querySelector('[data-testid="execution-context-view-complete-code"]')).toBeNull();
    });

    it('exposes an accessible tablist with the first tab selected', () => {
      const root = useRenderToDom(full());
      expect(root.querySelector('[role="tablist"]')).not.toBeNull();
      expect(query(root, tabSelector('variables')).getAttribute('role')).toBe('tab');
      expect(query(root, tabSelector('variables')).getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('docs variant', () => {
    it('stacks every section at once (scripts, variables, asserts, tests)', () => {
      const root = useRenderToDom(full({ variant: 'docs' }));
      expect(query(root, panelSelector('scripts')).text).toContain('Collection Pre-Request');
      expect(query(root, panelSelector('scripts')).text).toContain('HTTP');
      expect(query(root, panelSelector('variables')).text).toContain('sessionId');
      expect(query(root, panelSelector('asserts')).text).toContain('is defined');
      expect(query(root, panelSelector('tests')).text).toContain('returns a token');
      expect(query(root, flowSelector).text).toBe('Sandwich execution flow');
      expect(root.querySelector('[data-testid="execution-context-view-complete-code"]')).not.toBeNull();
    });
  });

  it('renders nothing when every section is empty', () => {
    const root = useRenderToDom(
      <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
    );
    expect(root.querySelector('[data-testid="execution-context"]')).toBeNull();
  });
});
