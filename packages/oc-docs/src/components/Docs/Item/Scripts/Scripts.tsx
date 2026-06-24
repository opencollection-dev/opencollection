import React, { useState } from 'react';
import { TabGroup } from '../../../../ui/MinimalComponents';
import { Code } from '../../../../ui/Code/Code';
import { StyledWrapper } from './StyledWrapper';

interface ScriptsProps {
  preRequest?: string | null;
  postResponse?: string | null;
  hideTitle?: boolean;
}

export const Scripts: React.FC<ScriptsProps> = ({
  preRequest,
  postResponse,
  hideTitle = false
}) => {
  const tabs = [
    ...(preRequest ? [{ id: 'pre', label: 'Pre-request', code: preRequest }] : []),
    ...(postResponse ? [{ id: 'post', label: 'Post-response', code: postResponse }] : [])
  ];

  if (tabs.length === 0) {
    return null;
  }

  const defaultTab = tabs[0]?.id ?? 'pre';

  return (
    <StyledWrapper>
      <div className="scripts-section">
        {!hideTitle && <h3 className="section-title">Scripts</h3>}
        <div className="scripts-card">
          <TabGroup
            tabs={tabs.map(({ id, label }) => ({ id, label }))}
            defaultTab={defaultTab}
            renderContent={(activeTab: string) => {
              const tab = tabs.find(({ id }) => id === activeTab) ?? tabs[0];
              const code = tab?.code ?? '';

              return (
                <ScriptsCodeContent code={code} />
              );
            }}
          />
        </div>
      </div>
    </StyledWrapper>
  );
};

const ScriptsCodeContent: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy script content', error);
      }
    }
  };

  return (
    <div className="scripts-code-wrapper">
      <Code
        code={code || ''}
        language="javascript"
      />
      <button
        className={`scripts-copy-button${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Script copied' : 'Copy script'}
        type="button"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};


