import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import styled from '@emotion/styled';

interface ExamplesProps {
  examples: HttpRequestExample[];
  method?: string;
  url?: string;
}

const StyledExamples = styled.div`
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
    background-color: var(--bg-primary, #ffffff);
  }

  .example-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-secondary, #f9fafb);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .example-tabs-left {
    display: flex;
    gap: 0;
    overflow-x: auto;
  }

  .example-tabs-right {
    padding-right: 0.75rem;
  }

  .example-url-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--bg-primary, #ffffff);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    font-family: var(--font-mono, 'SF Mono', 'Consolas', monospace);
    font-size: 0.75rem;
  }

  .example-url-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .example-method {
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #ffffff;
  }

  .example-method.get { background-color: #10b981; }
  .example-method.post { background-color: #3b82f6; }
  .example-method.put { background-color: #f59e0b; }
  .example-method.patch { background-color: #a855f7; }
  .example-method.delete { background-color: #ef4444; }

  .example-url {
    color: var(--text-primary, #111827);
    word-break: break-all;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    .example-content {
      grid-template-columns: 1fr;
    }
  }

  .content-section {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color, #e5e7eb);
    min-height: 150px;
  }

  .content-section:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    .content-section {
      border-right: none;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
    }

    .content-section:last-child {
      border-bottom: none;
    }
  }

  .section-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    min-height: 40px;
  }

  .content-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .status-badge.success {
    background-color: #dcfce7;
    color: #166534;
  }

  .status-badge.redirect {
    background-color: #fef3c7;
    color: #92400e;
  }

  .status-badge.client-error {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .status-badge.server-error {
    background-color: #fecaca;
    color: #7f1d1d;
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

  .toggle-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .copy-curl-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-secondary, #6b7280);
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .copy-curl-btn:hover {
    color: var(--text-primary, #111827);
    border-color: var(--text-secondary, #6b7280);
  }

  .copy-curl-btn.copied {
    color: #16a34a;
    border-color: #16a34a;
  }

  .copy-curl-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .copy-dropdown {
    position: relative;
  }

  .copy-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.25rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 10;
    min-width: 120px;
    overflow: hidden;
  }

  .copy-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary, #111827);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.15s ease;
  }

  .copy-menu-item:hover {
    background-color: var(--bg-secondary, #f9fafb);
  }

  .copy-menu-item.copied {
    color: #16a34a;
  }

  .body-content {
    padding: 0.75rem 1rem;
    overflow-x: auto;
    background-color: var(--code-bg, #f8fafc);
    flex: 1;
    position: relative;
  }

  .body-copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--text-secondary, #6b7280);
    transition: all 0.15s ease;
    opacity: 0;
  }

  .body-content:hover .body-copy-btn {
    opacity: 1;
  }

  .body-copy-btn:hover {
    color: var(--text-primary, #111827);
    border-color: var(--text-secondary, #6b7280);
  }

  .body-copy-btn.copied {
    color: #16a34a;
    border-color: #16a34a;
    opacity: 1;
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

  .no-content {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary, #6b7280);
    font-size: 0.75rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const getStatusClass = (status: number): string => {
  if (status >= 200 && status < 300) return 'success';
  if (status >= 300 && status < 400) return 'redirect';
  if (status >= 400 && status < 500) return 'client-error';
  if (status >= 500) return 'server-error';
  return '';
};

export const Examples: React.FC<ExamplesProps> = ({ examples, method = 'GET', url = '' }) => {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [requestTab, setRequestTab] = useState<'body' | 'headers' | 'params'>('body');
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState<string | null>(null);
  const [bodyCopied, setBodyCopied] = useState<'request' | 'response' | null>(null);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false);
      }
    };

    if (showCopyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCopyMenu]);

  // Filter to examples that have either request or response data
  const validExamples = useMemo(() =>
    examples.filter(ex => ex.request?.body || ex.request?.headers?.length || ex.response),
    [examples]
  );

  if (validExamples.length === 0) return null;

  const activeExample = validExamples[activeExampleIndex];
  const hasRequestBody = !!activeExample?.request?.body;
  const hasRequestHeaders = activeExample?.request?.headers && activeExample.request.headers.length > 0;
  const hasRequestParams = activeExample?.request?.params && activeExample.request.params.length > 0;
  const hasRequest = hasRequestBody || hasRequestHeaders || hasRequestParams;
  const hasResponse = !!activeExample?.response;
  const hasResponseHeaders = activeExample?.response?.headers && activeExample.response.headers.length > 0;
  const hasResponseBody = !!activeExample?.response?.body?.data;

  const formatJson = (data: any): string => {
    if (!data) return '';
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

  const getRequestData = () => {
    const exampleMethod = activeExample?.request?.method || method;
    const exampleUrl = activeExample?.request?.url || url;
    const headers = activeExample?.request?.headers || [];
    const body = activeExample?.request?.body;
    return { method: exampleMethod, url: exampleUrl, headers, body };
  };

  const generateCurlCommand = (): string => {
    const { method: m, url: u, headers, body } = getRequestData();

    const headersString = headers
      .map((h: any) => `-H "${h.name}: ${h.value}"`)
      .join(' \\\n  ');

    let bodyData = '';
    if (body?.data) {
      const data = typeof body.data === 'string' ? body.data.trim() : JSON.stringify(body.data);
      bodyData = ` \\\n  -d '${data}'`;
    }

    return `curl -X ${m} "${u}"${headersString ? ` \\\n  ${headersString}` : ''}${bodyData}`;
  };

  const generateJavaScriptCode = (): string => {
    const { method: m, url: u, headers, body } = getRequestData();
    const headersString = headers.map((h: any) => `    "${h.name}": "${h.value}"`).join(',\n');
    const bodyString = body?.data
      ? `,\n  body: JSON.stringify(${typeof body.data === 'string' ? body.data.trim() : JSON.stringify(body.data)})`
      : '';

    return `const response = await fetch("${u}", {
  method: "${m}",
  headers: {
${headersString}
  }${bodyString}
});

const data = await response.json();`;
  };

  const generatePythonCode = (): string => {
    const { method: m, url: u, headers, body } = getRequestData();
    const headersString = headers.map((h: any) => `        "${h.name}": "${h.value}"`).join(',\n');
    const bodyString = body?.data
      ? `,\n    json=${typeof body.data === 'string' ? body.data.trim() : JSON.stringify(body.data)}`
      : '';

    return `import requests

response = requests.${m.toLowerCase()}(
    "${u}",
    headers={
${headersString}
    }${bodyString}
)

data = response.json()`;
  };

  const handleCopy = async (type: 'curl' | 'javascript' | 'python') => {
    try {
      let code = '';
      switch (type) {
        case 'curl':
          code = generateCurlCommand();
          break;
        case 'javascript':
          code = generateJavaScriptCode();
          break;
        case 'python':
          code = generatePythonCode();
          break;
      }
      await navigator.clipboard.writeText(code);
      setCopied(type);
      setShowCopyMenu(false);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy code', error);
    }
  };

  const handleCopyBody = async (type: 'request' | 'response', content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setBodyCopied(type);
      setTimeout(() => setBodyCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy body', error);
    }
  };

  return (
    <StyledExamples>
      <h3 className="section-title">Examples</h3>
      <div className="examples-container">
        <div className="example-tabs">
          <div className="example-tabs-left">
            {validExamples.map((example, index) => (
              <button
                key={index}
                className={`example-tab ${activeExampleIndex === index ? 'active' : ''}`}
                onClick={() => {
                  setActiveExampleIndex(index);
                  setRequestTab('body');
                  setResponseTab('body');
                }}
              >
                {example.name || `Example ${index + 1}`}
              </button>
            ))}
          </div>
        </div>

        <div className="example-url-row">
          <div className="example-url-left">
            <span className={`example-method ${(activeExample?.request?.method || method).toLowerCase()}`}>
              {activeExample?.request?.method || method}
            </span>
            <span className="example-url">{activeExample?.request?.url || url}</span>
          </div>
          <div className="copy-dropdown" ref={dropdownRef}>
            <button
              className={`copy-curl-btn ${copied ? 'copied' : ''}`}
              onClick={() => setShowCopyMenu(!showCopyMenu)}
              disabled={!hasRequest}
              title="Copy as code"
            >
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              )}
              Code Snippet
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showCopyMenu && (
              <div className="copy-menu">
                <button
                  className={`copy-menu-item ${copied === 'curl' ? 'copied' : ''}`}
                  onClick={() => handleCopy('curl')}
                >
                  {copied === 'curl' ? '✓' : ''} cURL
                </button>
                <button
                  className={`copy-menu-item ${copied === 'javascript' ? 'copied' : ''}`}
                  onClick={() => handleCopy('javascript')}
                >
                  {copied === 'javascript' ? '✓' : ''} JavaScript
                </button>
                <button
                  className={`copy-menu-item ${copied === 'python' ? 'copied' : ''}`}
                  onClick={() => handleCopy('python')}
                >
                  {copied === 'python' ? '✓' : ''} Python
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="example-content">
          {/* Request Section - Always show */}
          <div className="content-section">
            <div className="content-header">
              <span className="content-label">Request</span>
              <div className="content-toggle">
                <button
                  className={`toggle-btn ${requestTab === 'body' ? 'active' : ''} ${!hasRequest ? 'disabled' : ''}`}
                  onClick={() => hasRequest && setRequestTab('body')}
                  disabled={!hasRequest}
                >
                  Body
                </button>
                <button
                  className={`toggle-btn ${requestTab === 'headers' ? 'active' : ''} ${!hasRequest ? 'disabled' : ''}`}
                  onClick={() => hasRequest && setRequestTab('headers')}
                  disabled={!hasRequest}
                >
                  Headers
                </button>
                <button
                  className={`toggle-btn ${requestTab === 'params' ? 'active' : ''} ${!hasRequest ? 'disabled' : ''}`}
                  onClick={() => hasRequest && setRequestTab('params')}
                  disabled={!hasRequest}
                >
                  Params
                </button>
              </div>
            </div>

            {hasRequest ? (
              <>
                {requestTab === 'body' && (
                  hasRequestBody ? (
                    <div className="body-content">
                      <button
                        className={`body-copy-btn ${bodyCopied === 'request' ? 'copied' : ''}`}
                        onClick={() => handleCopyBody('request', formatJson(activeExample.request?.body?.data))}
                        title="Copy"
                      >
                        {bodyCopied === 'request' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                      <pre>{formatJson(activeExample.request?.body?.data)}</pre>
                    </div>
                  ) : (
                    <div className="no-content">No request body</div>
                  )
                )}

                {requestTab === 'headers' && (
                  hasRequestHeaders ? (
                    <table className="headers-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeExample.request?.headers?.map((header, idx) => (
                          <tr key={idx}>
                            <td>{header.name}</td>
                            <td>{header.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-content">No request headers</div>
                  )
                )}

                {requestTab === 'params' && (
                  hasRequestParams ? (
                    <table className="headers-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeExample.request?.params?.map((param: any, idx: number) => (
                          <tr key={idx}>
                            <td>{param.name}</td>
                            <td>{param.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-content">No request params</div>
                  )
                )}
              </>
            ) : (
              <div className="no-content">No request data</div>
            )}
          </div>

          {/* Response Section - Always show */}
          <div className="content-section">
            <div className="content-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="content-label">Response</span>
                {activeExample.response?.status && (
                  <span className={`status-badge ${getStatusClass(activeExample.response.status)}`}>
                    {activeExample.response.status}
                  </span>
                )}
              </div>
              <div className="content-toggle">
                <button
                  className={`toggle-btn ${responseTab === 'body' ? 'active' : ''} ${!hasResponse ? 'disabled' : ''}`}
                  onClick={() => hasResponse && setResponseTab('body')}
                  disabled={!hasResponse}
                >
                  Body
                </button>
                <button
                  className={`toggle-btn ${responseTab === 'headers' ? 'active' : ''} ${!hasResponse ? 'disabled' : ''}`}
                  onClick={() => hasResponse && setResponseTab('headers')}
                  disabled={!hasResponse}
                >
                  Headers
                </button>
              </div>
            </div>

            {hasResponse ? (
              <>
                {responseTab === 'body' && (
                  hasResponseBody ? (
                    <div className="body-content">
                      <button
                        className={`body-copy-btn ${bodyCopied === 'response' ? 'copied' : ''}`}
                        onClick={() => handleCopyBody('response', formatJson(activeExample.response?.body?.data))}
                        title="Copy"
                      >
                        {bodyCopied === 'response' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                      <pre>{formatJson(activeExample.response?.body?.data)}</pre>
                    </div>
                  ) : (
                    <div className="no-content">No response body</div>
                  )
                )}

                {responseTab === 'headers' && (
                  hasResponseHeaders ? (
                    <table className="headers-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeExample.response?.headers?.map((header, idx) => (
                          <tr key={idx}>
                            <td>{header.name}</td>
                            <td>{header.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-content">No response headers</div>
                  )
                )}
              </>
            ) : (
              <div className="no-content">No response data</div>
            )}
          </div>
        </div>
      </div>
    </StyledExamples>
  );
};

export default Examples;
