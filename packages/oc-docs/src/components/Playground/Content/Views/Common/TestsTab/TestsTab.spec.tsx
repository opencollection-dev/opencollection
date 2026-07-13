import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useRenderToDom } from '@hooks/useRenderToDom';
import { query } from '../../../../../../test-utils/dom';

vi.mock('../../../../../../ui/CodeEditor/CodeEditor', () => ({
  default: ({ value }: { value: string }) => <pre data-testid="code-editor">{value}</pre>
}));

import { TestsTab } from './TestsTab';

const noop = () => {};

describe('TestsTab', () => {
  it('renders the title and description', () => {
    const root = useRenderToDom(
      <TestsTab
        scripts={{ tests: '' }}
        onScriptChange={noop}
        title="Tests"
        description="Assertions run after the response arrives"
      />
    );
    expect(query(root, '.title').text.trim()).toBe('Tests');
    expect(query(root, '.description').text.trim()).toBe('Assertions run after the response arrives');
  });

  it('passes the tests script into the editor', () => {
    const root = useRenderToDom(
      <TestsTab scripts={{ tests: 'expect(res.status).toBe(200);' }} onScriptChange={noop} />
    );
    expect(query(root, '[data-testid="code-editor"]').text).toContain('expect(res.status).toBe(200);');
  });
});
