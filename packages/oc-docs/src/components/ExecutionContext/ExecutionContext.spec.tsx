import React from 'react';
import { describe, it, expect } from 'vitest';
import { ExecutionContext } from './ExecutionContext';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query, getByTestId, queryByTestId } from '../../test-utils/dom';
import type { ScriptChainStep } from '../../utils/request';
import type { AssertionRow } from '../../utils/assertions';
import type { TestRow, RawTestScript } from '../../utils/fileUtils';

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

const tabId = (id: string) => `execution-context-tabs-tab-${id}`;
const panelId = (id: string) => `execution-context-${id}`;
const flowTestId = 'execution-context-flow';

describe('ExecutionContext', () => {
  describe('tabs variant (default)', () => {
    it('renders a tab per non-empty section, each with its item count', () => {
      const root = useRenderToDom(full());
      expect(query(getByTestId(root, tabId('variables')), '.tab-count').text).toBe('2');
      expect(query(getByTestId(root, tabId('scripts')), '.tab-count').text).toBe('3');
      expect(query(getByTestId(root, tabId('asserts')), '.tab-count').text).toBe('2');
      expect(query(getByTestId(root, tabId('tests')), '.tab-count').text).toBe('2');
    });

    it('mounts only the active tab panel (Variables first)', () => {
      const root = useRenderToDom(full());
      expect(getByTestId(root, panelId('variables')).text).toContain('sessionId');
      expect(queryByTestId(root, panelId('scripts'))).toBeNull();
      expect(queryByTestId(root, panelId('asserts'))).toBeNull();
      expect(queryByTestId(root, panelId('tests'))).toBeNull();
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
      expect(queryByTestId(root, tabId('variables'))).not.toBeNull();
      expect(queryByTestId(root, tabId('scripts'))).not.toBeNull();
      expect(queryByTestId(root, tabId('asserts'))).toBeNull();
      expect(queryByTestId(root, tabId('tests'))).toBeNull();
    });

    it('shows the execution-flow indicator only while the Scripts tab is active', () => {
      expect(queryByTestId(useRenderToDom(full()), flowTestId)).toBeNull();

      const scriptsOnly = useRenderToDom(
        <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
      );
      expect(getByTestId(scriptsOnly, flowTestId).text).toBe('Sandwich execution flow');

      const sequential = useRenderToDom(
        <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} flow="sequential" />
      );
      expect(getByTestId(sequential, flowTestId).text).toBe('Sequential execution flow');
    });

    it('shows "View complete code" in the header only while the Tests tab is active', () => {
      const testsOnly = useRenderToDom(
        <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={tests} testScripts={testScripts} />
      );
      expect(queryByTestId(testsOnly, 'execution-context-view-complete-code')).not.toBeNull();
      expect(queryByTestId(useRenderToDom(full()), 'execution-context-view-complete-code')).toBeNull();
    });

    it('exposes an accessible tablist with the first tab selected', () => {
      const root = useRenderToDom(full());
      expect(root.querySelector('[role="tablist"]')).not.toBeNull();
      expect(getByTestId(root, tabId('variables')).getAttribute('role')).toBe('tab');
      expect(getByTestId(root, tabId('variables')).getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('docs variant', () => {
    it('stacks every section at once (scripts, variables, asserts, tests)', () => {
      const root = useRenderToDom(full({ variant: 'docs' }));
      expect(getByTestId(root, panelId('scripts')).text).toContain('Collection Pre-Request');
      expect(getByTestId(root, panelId('scripts')).text).toContain('HTTP');
      expect(getByTestId(root, panelId('variables')).text).toContain('sessionId');
      expect(getByTestId(root, panelId('asserts')).text).toContain('is defined');
      expect(getByTestId(root, panelId('tests')).text).toContain('returns a token');
      expect(getByTestId(root, flowTestId).text).toBe('Sandwich execution flow');
      expect(queryByTestId(root, 'execution-context-view-complete-code')).not.toBeNull();
    });
  });

  it('renders nothing when every section is empty', () => {
    const root = useRenderToDom(
      <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
    );
    expect(queryByTestId(root, 'execution-context')).toBeNull();
  });
});
