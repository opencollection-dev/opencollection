import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';

vi.mock('../../../../../../ui/CodeEditor/CodeEditor', () => ({
  default: ({ value }: { value: string }) => <pre data-testid="code-editor">{value}</pre>
}));

import BulkEdit from './BulkEdit';

describe('BulkEdit', () => {
  it('serializes enabled rows as name:value lines', () => {
    const root = useRenderToDom(
      <BulkEdit
        data={[
          { id: 'r1', name: 'Content-Type', value: 'application/json', enabled: true },
          { id: 'r2', name: 'Accept', value: 'text/plain', enabled: true }
        ]}
        onChange={() => {}}
      />
    );
    const editor = root.querySelector('[data-testid="code-editor"]');
    expect(editor).toBeTruthy();
    expect(editor?.text).toContain('Content-Type:application/json');
    expect(editor?.text).toContain('Accept:text/plain');
  });

  it('prefixes disabled rows with //', () => {
    const root = useRenderToDom(
      <BulkEdit
        data={[
          { id: 'r1', name: 'X-Enabled', value: 'yes', enabled: true },
          { id: 'r2', name: 'X-Disabled', value: 'no', enabled: false }
        ]}
        onChange={() => {}}
      />
    );
    const editor = root.querySelector('[data-testid="code-editor"]');
    expect(editor).toBeTruthy();
    expect(editor?.text).toContain('X-Enabled:yes');
    expect(editor?.text).toContain('//X-Disabled:no');
  });
});
