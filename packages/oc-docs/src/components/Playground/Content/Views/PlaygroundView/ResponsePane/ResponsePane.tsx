import React, { useState } from 'react';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import Dropdown from '../../../../../../ui/Dropdown/Dropdown';
import ResponseBodyTab, { languageForContentType } from '../../Common/ResponseBodyTab';
import ResponseHeadersTab from '../../Common/ResponseHeadersTab';
import TestResultsTab from '../../Common/TestResultsTab';
import ErrorBanner from '../../../../../../ui/ErrorBanner/ErrorBanner';
import { StyledWrapper } from './StyledWrapper';

interface ResponsePaneProps {
  response: any;
  isLoading: boolean;
}

const RESPONSE_FORMATS: { id: string; label: string; glyph?: string }[] = [
  { id: 'json', label: 'JSON', glyph: '{ }' },
  { id: 'xml', label: 'XML', glyph: '</>' },
  { id: 'html', label: 'HTML' },
  { id: 'text', label: 'Text' }
];

const formatLabel = (id: string): string => {
  const format = RESPONSE_FORMATS.find((option) => option.id === id);
  if (!format) return 'Text';
  return format.glyph ? `${format.glyph} ${format.label}` : format.label;
};

const ResponsePane: React.FC<ResponsePaneProps> = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState('response');
  const [format, setFormat] = useState<string | null>(null);

  const getStatusColor = (status?: number) => {
    if (!status) return 'var(--oc-request-tab-panel-response-status)';
    if (status >= 200 && status < 300) return 'var(--oc-request-tab-panel-response-ok)';
    if (status >= 300 && status < 400) return 'var(--oc-colors-text-warning)';
    if (status >= 400) return 'var(--oc-request-tab-panel-response-error)';
    return 'var(--oc-request-tab-panel-response-status)';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span style={{ color: 'var(--text-secondary)' }}>Sending request...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            <svg fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Click Send to make a request</p>
        </div>
      </div>
    );
  }

  // A failed request (no HTTP response) renders a danger banner inside the
  // Response tab, keeping the same tab shell as a successful response.
  const renderErrorBanner = () => (
    <div className="p-4">
      <ErrorBanner title={response.errorTitle || 'Request Failed'} message={response.error} />
    </div>
  );

  const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'] || '';
  const activeFormat = format || languageForContentType(contentType);

  const headersCount = response.headers ? Object.keys(response.headers).length : 0;
  const hasTestResults = response.testResults && response.testResults.results.length > 0;
  const hasAssertionResults = response.assertionResults && response.assertionResults.results.length > 0;
  const testsCount = hasTestResults || hasAssertionResults ? '•' : undefined;

  const statusInfo = (
    <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
      <span className="font-semibold" style={{ color: getStatusColor(response.status) }} data-testid="response-status">
        {response.status} {response.statusText}
      </span>
      {response.duration != null && (
        <span style={{ color: 'var(--text-secondary)' }}>{response.duration} ms</span>
      )}
      {response.size != null && (
        <span style={{ color: 'var(--text-secondary)' }}>{(response.size / 1024).toFixed(2)} KB</span>
      )}
    </div>
  );

  const formatSelector = (
    <Dropdown label={formatLabel(activeFormat)} active menuLabel="Response format" align="right" testId="response-format">
      {({ close }) =>
        RESPONSE_FORMATS.map((option) => (
          <li key={option.id} role="option" aria-selected={option.id === activeFormat}>
            <button
              type="button"
              className={`dropdown-option${option.id === activeFormat ? ' is-selected' : ''}`}
              onClick={() => {
                setFormat(option.id);
                close();
              }}
            >
              <span className="dropdown-label">{option.label}</span>
              {option.id === activeFormat && <span className="dropdown-check" aria-hidden="true">✓</span>}
            </button>
          </li>
        ))
      }
    </Dropdown>
  );

  const tabs = [
    {
      id: 'response',
      label: 'Response',
      rightElement: response.error ? undefined : (
        <div className="flex items-center gap-3">
          {statusInfo}
          {formatSelector}
        </div>
      ),
      content: response.error ? renderErrorBanner() : <ResponseBodyTab response={response} language={activeFormat} />
    },
    {
      id: 'headers',
      label: 'Headers',
      contentIndicator: headersCount || undefined,
      content: <ResponseHeadersTab headers={response.headers} />
    },
    {
      id: 'tests',
      label: 'Tests',
      contentIndicator: testsCount,
      content: <TestResultsTab testResults={response.testResults} assertionResults={response.assertionResults} />
    }
  ];

  return (
    <StyledWrapper>
      <Tabs
        className='h-full'
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightElement={response.error ? undefined : statusInfo}
      />
    </StyledWrapper>
  );
};

export default ResponsePane;
