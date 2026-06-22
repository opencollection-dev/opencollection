import React, { useMemo, useState } from 'react';
import type { HttpRequestBody, HttpRequestBodyVariant, HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '../Code/Code';
import { CopyButton} from '../../ui/CopyButton/CopyButton';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { Modal } from '../Modal';
import {
  generateCurlCommand,
  generateJavaScriptCode,
  generatePythonCode,
  type SnippetHeader,
  type SnippetInput
} from '../../utils/codegen';
import { CodeSnippetTabsWrapper } from './StyledWrapper';

interface CodeSnippetTabsProps {
  method: string;
  url: string;
  headers?: HttpRequestHeader[];
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  auth?: Auth;
  className?: string;
}

const LANGUAGES = [
  { id: 'curl', label: 'cURL', language: 'bash', generate: generateCurlCommand },
  { id: 'javascript', label: 'Javascript', language: 'javascript', generate: generateJavaScriptCode },
  { id: 'python', label: 'Python', language: 'python', generate: generatePythonCode }
] as const;

/** Maximize glyph (diagonal arrows out) for the expand-to-fullscreen control. */
const ExpandGlyph: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

/** Generated request snippets (cURL / Javascript / Python) with a copy button and expand-to-fullscreen. */
export const CodeSnippetTabs: React.FC<CodeSnippetTabsProps> = ({ method, url, headers, body, auth, className }) => {
  const [active, setActive] = useState<string>(LANGUAGES[0].id);
  const [expanded, setExpanded] = useState(false);

  const snippetHeaders: SnippetHeader[] = useMemo(
    () =>
      (headers ?? [])
        .filter((header) => header && header.name && header.disabled !== true)
        .map((header) => ({ name: header.name, value: header.value })),
    [headers]
  );

  const snippets = useMemo(() => {
    const input: SnippetInput = { method, url, headers: snippetHeaders, body, auth };
    return LANGUAGES.reduce<Record<string, string>>((acc, lang) => {
      acc[lang.id] = lang.generate(input);
      return acc;
    }, {});
  }, [method, url, snippetHeaders, body, auth]);

  const activeLang = LANGUAGES.find((lang) => lang.id === active) ?? LANGUAGES[0];

  /**
   * The unified, bordered panel — identical in both contexts — whose header bar
   * holds the language tabs and a right-side control, with the active snippet below
   * a divider. Inline: the header shows the expand control and the code its floating
   * copy. Modal: the header shows a copy button (the dialog supplies title + close),
   * and the code's floating copy is suppressed.
   */
  const renderSnippetBox = (variant: 'inline' | 'modal') => (
    <div className="oc-snippet-box">
      <div className="oc-snippet-head">
        <div className="oc-snippet-tabs" role="tablist" aria-label="Snippet language">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              role="tab"
              aria-selected={active === lang.id}
              className={['oc-snippet-tab', active === lang.id ? 'is-active' : ''].filter(Boolean).join(' ')}
              onClick={() => setActive(lang.id)}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <span className="oc-snippet-head-spacer" />
        {variant === 'inline' ? (
          <button
            type="button"
            className="oc-code-snippet-expand"
            aria-label="Expand code snippet"
            onClick={() => setExpanded(true)}
          >
            <ExpandGlyph />
          </button>
        ) : (
          <CopyButton text={snippets[active]} label="Copy code" className="oc-snippet-copy" />
        )}
      </div>
      <Code code={snippets[active]} language={activeLang.language} showLineNumbers showCopy={variant === 'inline'} />
    </div>
  );

  return (
    <CodeSnippetTabsWrapper className={['oc-code-snippet-tabs', className].filter(Boolean).join(' ')}>
      {renderSnippetBox('inline')}
      <Modal open={expanded} onClose={() => setExpanded(false)} title={<SectionLabel>Code snippet</SectionLabel>} ariaLabel="Code snippet">
        {expanded && (
          <CodeSnippetTabsWrapper className="oc-code-snippet-tabs">{renderSnippetBox('modal')}</CodeSnippetTabsWrapper>
        )}
      </Modal>
    </CodeSnippetTabsWrapper>
  );
};

export default CodeSnippetTabs;
