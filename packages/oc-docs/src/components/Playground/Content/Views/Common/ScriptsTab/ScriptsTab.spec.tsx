import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { query } from '../../../../../../test-utils/dom';

vi.mock('../../../../../../ui/CodeEditor/CodeEditor', () => ({
  default: ({ value }: { value: string }) => <pre data-testid="code-editor">{value}</pre>
}));

import { ScriptsTab } from './ScriptsTab';

const noop = () => {};

describe('ScriptsTab', () => {
  it('renders the pre/post sub-tab labels', () => {
    const root = useRenderToDom(<ScriptsTab scripts={{}} onScriptChange={noop} />);
    expect(query(root, '[data-testid="scripts-tabs-tab-pre-request"]').text.trim()).toBe('Pre request');
    expect(query(root, '[data-testid="scripts-tabs-tab-post-response"]').text.trim()).toBe('Post response');
  });

  it('renders the Tests section by default', () => {
    const root = useRenderToDom(<ScriptsTab scripts={{}} onScriptChange={noop} />);
    expect(query(root, '.label').text.trim()).toBe('Tests');
  });

  it('renders a custom title and description and can hide the Tests section', () => {
    const root = useRenderToDom(
      <ScriptsTab
        scripts={{}}
        onScriptChange={noop}
        title="Request Scripts"
        description="Runs around the request"
        showTests={false}
      />
    );
    expect(query(root, '.title').text.trim()).toBe('Request Scripts');
    expect(query(root, '.description').text.trim()).toBe('Runs around the request');
    expect(root.querySelector('.label')).toBeNull();
  });
});
