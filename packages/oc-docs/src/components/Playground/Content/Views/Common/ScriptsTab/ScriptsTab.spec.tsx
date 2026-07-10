import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';

vi.mock('../../../../../../ui/CodeEditor/CodeEditor', () => ({
  default: ({ value }: { value: string }) => <pre data-testid="code-editor">{value}</pre>
}));

import { ScriptsTab } from './ScriptsTab';

const noop = () => {};

describe('ScriptsTab', () => {
  it('renders the pre/post sub-tab labels', () => {
    const root = useRenderToDom(<ScriptsTab scripts={{}} onScriptChange={noop} />);
    expect(root.querySelector('[data-testid="scripts-tabs-tab-pre-request"]')?.text.trim()).toBe('Pre request');
    expect(root.querySelector('[data-testid="scripts-tabs-tab-post-response"]')?.text.trim()).toBe('Post response');
  });

  it('renders a provided title and the Tests section', () => {
    const root = useRenderToDom(<ScriptsTab scripts={{}} onScriptChange={noop} title="Scripts" />);
    expect(root.querySelector('.title')?.text.trim()).toBe('Scripts');
    expect(root.querySelector('.label')?.text.trim()).toBe('Tests');
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
    expect(root.querySelector('.title')?.text.trim()).toBe('Request Scripts');
    expect(root.querySelector('.description')?.text.trim()).toBe('Runs around the request');
    expect(root.querySelector('.label')).toBeNull();
  });
});
