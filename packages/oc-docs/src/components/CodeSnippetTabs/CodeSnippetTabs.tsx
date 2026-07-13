import React, { useMemo, useState } from 'react';
import type { HttpRequestBody, HttpRequestBodyVariant, HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '@components/Code/Code';
import { CopyButton} from '@ui/CopyButton/CopyButton';
import { useResolvedVariables } from '@hooks';
import { SectionLabel } from '@components/SectionLabel/SectionLabel';
import { Modal } from '@ui/Modal/Modal';
import { ExpandIcon } from '../../assets/icons';
import {
  generateCurlCommand,
  generateJavaScriptCode,
  generatePythonCode,
  type SnippetHeader,
  type SnippetInput
} from '@utils/codeSnippets';
import { StyledWrapper } from './StyledWrapper';

interface CodeSnippetTabsProps {
  method: string;
  url: string;
  headers?: HttpRequestHeader[];
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  auth?: Auth;
  className?: string;
  testId?: string;
}

const LANGUAGES = [
  { id: 'curl', label: 'cURL', language: 'bash', generate: generateCurlCommand },
  { id: 'javascript', label: 'Javascript', language: 'javascript', generate: generateJavaScriptCode },
  { id: 'python', label: 'Python', language: 'python', generate: generatePythonCode }
] as const;

export const CodeSnippetTabs: React.FC<CodeSnippetTabsProps> = ({ method, url, headers, body, auth, className, testId = 'request-code-snippet' }) => {
  const [active, setActive] = useState<string>(LANGUAGES[0].id);
  const [modalActive, setModalActive] = useState<string>(LANGUAGES[0].id);
  const [expanded, setExpanded] = useState(false);
  const { showVars, resolve } = useResolvedVariables();

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

  const openModal = () => {
    setModalActive(active);
    setExpanded(true);
  };

  const renderSnippetBox = (
    variant: 'inline' | 'modal',
    activeId: string,
    setActiveId: (id: string) => void
  ) => {
    const activeLang = LANGUAGES.find((lang) => lang.id === activeId) ?? LANGUAGES[0];
    const snippet = snippets[activeId];
    const copyText = showVars ? resolve(snippet) : snippet;
    return (
      <div className="snippet-box">
        <div className="snippet-head">
          <div className="snippet-tabs" role="tablist" aria-label="Snippet language">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                role="tab"
                aria-selected={activeId === lang.id}
                data-testid={`code-snippet-tab-${lang.id}`}
                className={['snippet-tab', activeId === lang.id ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={() => setActiveId(lang.id)}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <span className="snippet-head-spacer" />
          {variant === 'inline' ? (
            <button
              type="button"
              className="code-snippet-expand"
              aria-label="Expand code snippet"
              data-testid="code-snippet-expand"
              onClick={openModal}
            >
              <ExpandIcon />
            </button>
          ) : (
            <CopyButton text={copyText} label="Copy code" className="snippet-copy" />
          )}
        </div>
        <Code code={snippet} language={activeLang.language} showLineNumbers showCopy={variant === 'inline'} variableAware copyText={copyText} testId="code-snippet-code" />
      </div>
    );
  };

  return (
    <StyledWrapper className={['code-snippet-tabs', className].filter(Boolean).join(' ')} data-testid={testId}>
      {renderSnippetBox('inline', active, setActive)}
      <Modal open={expanded} onClose={() => setExpanded(false)} title={<SectionLabel>Code snippet</SectionLabel>} ariaLabel="Code snippet">
        {expanded && (
          <StyledWrapper className="code-snippet-tabs" data-testid="code-snippet-modal">{renderSnippetBox('modal', modalActive, setModalActive)}</StyledWrapper>
        )}
      </Modal>
    </StyledWrapper>
  );
};

export default CodeSnippetTabs;
