import React from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import styled from '@emotion/styled';

interface RequestExamplesProps {
  examples: HttpRequestExample[];
  activeExampleName?: string | null;
  onExampleChange?: (name: string | null) => void;
}

const StyledRequestExamples = styled.div`
  margin-top: 1rem;

  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .examples-container {
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .example-tabs {
    display: flex;
    gap: 0;
    background-color: var(--bg-secondary, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    overflow-x: auto;
  }

  .example-tab {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    color: var(--text-secondary, #6b7280);
    white-space: nowrap;
  }

  .example-tab:hover {
    color: var(--text-primary, #111827);
    background-color: var(--bg-primary, #ffffff);
  }

  .example-tab.active {
    color: var(--primary-color, #3b82f6);
    border-bottom-color: var(--primary-color, #3b82f6);
    background-color: var(--bg-primary, #ffffff);
  }

  .example-content {
    padding: 0;
  }

  .body-content {
    padding: 0.75rem 1rem;
    overflow-x: auto;
    background-color: var(--code-bg, #f8fafc);
  }

  .body-content pre {
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
    font-family: var(--font-mono, 'SF Mono', 'Consolas', monospace);
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--code-text, #1e293b);
  }

  .no-content {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary, #6b7280);
    font-size: 0.75rem;
  }
`;

export const RequestExamples: React.FC<RequestExamplesProps> = ({
  examples,
  activeExampleName,
  onExampleChange
}) => {
  // Filter examples that have request data
  const requestExamples = examples.filter(ex => ex.request?.body);

  if (requestExamples.length === 0) return null;

  // Find active index based on name, or default to 0
  const activeIndex = activeExampleName
    ? Math.max(0, requestExamples.findIndex(ex => ex.name === activeExampleName))
    : 0;

  const activeExample = requestExamples[activeIndex];

  const handleExampleChange = (index: number) => {
    const example = requestExamples[index];
    if (onExampleChange && example) {
      onExampleChange(example.name || null);
    }
  };

  const formatBody = (body: any): string => {
    if (!body?.data) return '';
    const data = body.data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <StyledRequestExamples>
      <h3 className="section-title">Request Examples</h3>
      <div className="examples-container">
        {requestExamples.length > 1 && (
          <div className="example-tabs">
            {requestExamples.map((example, index) => (
              <button
                key={index}
                className={`example-tab ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleExampleChange(index)}
              >
                {example.name || `Example ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        <div className="example-content">
          {activeExample.request?.body ? (
            <div className="body-content">
              <pre>{formatBody(activeExample.request.body)}</pre>
            </div>
          ) : (
            <div className="no-content">No request body</div>
          )}
        </div>
      </div>
    </StyledRequestExamples>
  );
};

export default RequestExamples;
