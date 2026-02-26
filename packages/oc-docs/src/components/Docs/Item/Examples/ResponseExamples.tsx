import React, { useState, useMemo, useEffect } from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import styled from '@emotion/styled';

interface ResponseExamplesProps {
  examples: HttpRequestExample[];
  activeExampleName?: string | null;
  onExampleChange?: (name: string | null) => void;
}

const StyledResponseExamples = styled.div`
  margin-top: 1rem;

  .examples-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem 0;
  }

  .examples-container {
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid var(--border-color, #e5e7eb);
    background-color: var(--bg-primary, #ffffff);
  }

  .status-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-secondary, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    overflow-x: auto;
  }

  .status-tabs-left {
    display: flex;
    gap: 0;
  }

  .status-tab {
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

  .status-tab:hover {
    color: var(--text-primary, #111827);
    background-color: var(--bg-primary, #ffffff);
  }

  .status-tab.active {
    color: var(--primary-color, #3b82f6);
    border-bottom-color: var(--primary-color, #3b82f6);
    background-color: var(--bg-primary, #ffffff);
  }

  .right-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-right: 0.75rem;
  }

  .content-toggle {
    display: flex;
    align-items: center;
    background-color: var(--bg-primary, #ffffff);
    border-radius: 0.25rem;
    padding: 0.125rem;
    border: 1px solid var(--border-color, #e5e7eb);
  }

  .toggle-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-secondary, #6b7280);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 0.125rem;
    transition: all 0.15s ease;
  }

  .toggle-btn:hover {
    color: var(--text-primary, #111827);
  }

  .toggle-btn.active {
    color: var(--text-primary, #111827);
    background-color: var(--bg-secondary, #f3f4f6);
  }

  .example-select {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.65rem;
    font-weight: 500;
    background-color: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    color: var(--text-primary, #111827);
    cursor: pointer;
    min-width: 100px;
    text-align: left;
  }

  .example-select:focus {
    outline: none;
    border-color: var(--primary-color, #3b82f6);
  }

  .example-select.single {
    cursor: default;
    background-color: var(--bg-secondary, #f9fafb);
    border-color: transparent;
  }

  .headers-table {
    width: 100%;
    font-size: 0.75rem;
    border-collapse: collapse;
  }

  .headers-table th {
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 500;
    color: var(--text-secondary, #6b7280);
    background-color: var(--bg-secondary, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .headers-table td {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    color: var(--text-primary, #111827);
    font-family: var(--font-mono, monospace);
  }

  .headers-table tr:last-child td {
    border-bottom: none;
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

interface GroupedExamples {
  [status: number]: HttpRequestExample[];
}

export const ResponseExamples: React.FC<ResponseExamplesProps> = ({
  examples,
  activeExampleName,
  onExampleChange
}) => {
  // Filter examples that have response data
  const responseExamples = useMemo(() =>
    examples.filter(ex => ex.response),
    [examples]
  );

  // Group examples by status code
  const groupedByStatus = useMemo(() => {
    const grouped: GroupedExamples = {};
    responseExamples.forEach(ex => {
      const status = ex.response?.status || 0;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(ex);
    });
    return grouped;
  }, [responseExamples]);

  const statusCodes = useMemo(() =>
    Object.keys(groupedByStatus).map(Number).sort((a, b) => a - b),
    [groupedByStatus]
  );

  const [activeStatus, setActiveStatus] = useState<number>(statusCodes[0] || 0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  // Sync with activeExampleName from parent
  useEffect(() => {
    if (activeExampleName) {
      // Find the example by name
      const example = responseExamples.find(ex => ex.name === activeExampleName);
      if (example) {
        const status = example.response?.status || 0;
        const examplesForStatus = groupedByStatus[status] || [];
        const indexInGroup = examplesForStatus.findIndex(ex => ex.name === activeExampleName);
        if (indexInGroup >= 0) {
          setActiveStatus(status);
          setActiveExampleIndex(indexInGroup);
          setActiveTab('body');
        }
      }
    }
  }, [activeExampleName, responseExamples, groupedByStatus]);

  if (responseExamples.length === 0 || statusCodes.length === 0) return null;

  const currentExamples = groupedByStatus[activeStatus] || [];
  const activeExample = currentExamples[activeExampleIndex];
  const response = activeExample?.response;
  const hasHeaders = response?.headers && response.headers.length > 0;
  const hasBody = response?.body?.data;
  const hasMultipleExamples = currentExamples.length > 1;

  const formatJson = (data: string): string => {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return data;
    }
  };

  const handleStatusChange = (status: number) => {
    setActiveStatus(status);
    setActiveExampleIndex(0);
    setActiveTab('body');
    // Notify parent of the first example in this status group
    const firstExample = groupedByStatus[status]?.[0];
    if (onExampleChange && firstExample) {
      onExampleChange(firstExample.name || null);
    }
  };

  const handleExampleIndexChange = (index: number) => {
    setActiveExampleIndex(index);
    setActiveTab('body');
    // Notify parent of the selected example
    const example = currentExamples[index];
    if (onExampleChange && example) {
      onExampleChange(example.name || null);
    }
  };

  return (
    <StyledResponseExamples>
      <h3 className="examples-title">Response Examples</h3>
      <div className="examples-container">
        {/* Status code tabs with controls on right */}
        <div className="status-tabs">
          <div className="status-tabs-left">
            {statusCodes.map(status => (
              <button
                key={status}
                className={`status-tab ${activeStatus === status ? 'active' : ''}`}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="right-controls">
            {/* Body/Headers toggle */}
            {hasHeaders && (
              <div className="content-toggle">
                <button
                  className={`toggle-btn ${activeTab === 'body' ? 'active' : ''}`}
                  onClick={() => setActiveTab('body')}
                >
                  Body
                </button>
                <button
                  className={`toggle-btn ${activeTab === 'headers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('headers')}
                >
                  Headers
                </button>
              </div>
            )}

            {/* Example selector - consistent appearance */}
            {hasMultipleExamples ? (
              <select
                className="example-select"
                value={activeExampleIndex}
                onChange={(e) => handleExampleIndexChange(Number(e.target.value))}
              >
                {currentExamples.map((ex, idx) => (
                  <option key={idx} value={idx}>
                    {ex.name || `Example ${idx + 1}`}
                  </option>
                ))}
              </select>
            ) : (
              <span className="example-select single">
                {activeExample?.name || 'Example'}
              </span>
            )}
          </div>
        </div>

        {response && (
          <div className="example-content">
            {/* Body tab content */}
            {activeTab === 'body' && (
              <div>
                {hasBody ? (
                  <div className="body-content">
                    <pre>{formatJson(response.body?.data || '')}</pre>
                  </div>
                ) : (
                  <div className="no-content">No body content</div>
                )}
              </div>
            )}

            {/* Headers tab content */}
            {activeTab === 'headers' && hasHeaders && (
              <div>
                <table className="headers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.headers?.map((header, idx) => (
                      <tr key={idx}>
                        <td>{header.name}</td>
                        <td>{header.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!response && (
          <div className="no-content">No response example available</div>
        )}
      </div>
    </StyledResponseExamples>
  );
};

export default ResponseExamples;
