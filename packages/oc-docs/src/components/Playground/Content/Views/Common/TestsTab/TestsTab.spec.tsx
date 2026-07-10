import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';

vi.mock('../../../../../../ui/CodeEditor/CodeEditor', () => ({
  default: ({ value }: { value: string }) => <pre data-testid="code-editor">{value}</pre>
}));

import { TestsTab } from '.';

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
    expect(root.querySelector('.title')?.text.trim()).toBe('Tests');
    expect(root.querySelector('.description')?.text.trim()).toBe('Assertions run after the response arrives');
  });

  it('passes the tests script into the editor', () => {
    const root = useRenderToDom(
      <TestsTab scripts={{ tests: 'expect(res.status).toBe(200);' }} onScriptChange={noop} />
    );
    expect(root.querySelector('[data-testid="code-editor"]')?.text).toContain('expect(res.status).toBe(200);');
  });
});
