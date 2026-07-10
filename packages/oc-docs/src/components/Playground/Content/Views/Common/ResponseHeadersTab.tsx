import React from 'react';
import styled from '@emotion/styled';

interface ResponseHeadersTabProps {
  headers?: Record<string, any>;
}

const Wrapper = styled.div`
  .headers-card {
    border: 1px solid var(--border-color);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }

  .header-row {
    display: flex;
    gap: 1rem;
    padding: 0.625rem 0.875rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
  }

  .header-row + .header-row {
    border-top: 1px solid var(--border-color);
  }

  .header-key {
    width: 35%;
    flex-shrink: 0;
    color: var(--text-primary);
    word-break: break-word;
  }

  .header-value {
    flex: 1;
    min-width: 0;
    color: var(--text-secondary);
    word-break: break-all;
  }
`;

const ResponseHeadersTab: React.FC<ResponseHeadersTabProps> = ({ headers }) => {
  const entries = headers ? Object.entries(headers) : [];

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        No response headers
      </div>
    );
  }

  return (
    <Wrapper className="py-4">
      <div className="headers-card">
        {entries.map(([key, value]) => (
          <div key={key} className="header-row">
            <span className="header-key">{key}</span>
            <span className="header-value">{String(value)}</span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default ResponseHeadersTab;
