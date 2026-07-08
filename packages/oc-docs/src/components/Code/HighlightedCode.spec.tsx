import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { HighlightedCode } from './HighlightedCode';

const vars = (root: ReturnType<typeof useRenderToDom>) => root.querySelectorAll('.var');

describe('HighlightedCode', () => {
  it('wraps an unquoted variable as a token even where the grammar would split the braces', () => {
    const root = useRenderToDom(<HighlightedCode code={'curl {{baseUrl}}/api'} language="bash" />);
    const token = root.querySelector('[data-var-name="baseUrl"]');
    expect(token).not.toBeNull();
    expect(token?.text).toBe('{{baseUrl}}');
    expect(vars(root)).toHaveLength(1);
  });

  it('wraps a variable that sits inside a quoted string literal', () => {
    const root = useRenderToDom(<HighlightedCode code={"--header 'Authorization: Bearer {{token}}'"} language="bash" />);
    const token = root.querySelector('[data-var-name="token"]');
    expect(token).not.toBeNull();
    expect(token?.text).toBe('{{token}}');
  });

  it('finds every variable across a multi-variable URL', () => {
    const root = useRenderToDom(<HighlightedCode code={'{{host}}/customers/{{userId}}?v={{apiVersion}}'} language="bash" />);
    const names = Array.from(vars(root)).map((el) => el.getAttribute('data-var-name'));
    expect(names).toEqual(['host', 'userId', 'apiVersion']);
  });

  it('still applies Prism token classes to non-variable code', () => {
    const root = useRenderToDom(<HighlightedCode code={'const a = 1;'} language="javascript" />);
    expect(root.querySelector('.token.keyword')?.text).toBe('const');
    expect(root.querySelector('.var')).toBeNull();
  });

  it('renders plain text for an unknown language without throwing', () => {
    const root = useRenderToDom(<HighlightedCode code={'hello {{name}}'} language="not-a-language" />);
    expect(root.querySelector('[data-var-name="name"]')?.text).toBe('{{name}}');
    expect(root.text).toContain('hello');
  });
});
