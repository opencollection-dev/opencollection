import React, { useState } from 'react';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import ResponseBodyTab from '../../Common/ResponseBodyTab';
import ResponseHeadersTab from '../../Common/ResponseHeadersTab';
import TestResultsTab from '../../Common/TestResultsTab';
import ErrorBanner from '../../../../../../ui/ErrorBanner/ErrorBanner';
import ResponseFormatSelector from './ResponseFormatter';
import { useResponseFormatter } from './ResponseFormatter/useResponseFormatter';
import { RunRequestResponse } from '../../../../../../runner';
import type { ResponseBodyFormat } from '../../../../../../utils/response';
import { StyledWrapper } from './StyledWrapper';

interface ResponsePaneProps {
  response: RunRequestResponse;
  isLoading: boolean;
}

const ResponsePane: React.FC<ResponsePaneProps> = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState('response');
  const { selectedFormat, showPreview, handleFormatChange, handleViewChange } = useResponseFormatter(response);

  const getStatusColor = (status?: number) => {
    if (!status) return 'var(--oc-request-tab-panel-response-status)';
    if (status >= 200 && status < 300) return 'var(--oc-request-tab-panel-response-ok)';
    if (status >= 300 && status < 400) return 'var(--oc-colors-text-warning)';
    if (status >= 400 && status < 500) return 'var(--oc-request-tab-panel-response-error)';
    if (status >= 500) return 'var(--oc-request-tab-panel-response-error)';
    return 'var(--oc-request-tab-panel-response-status)';
  };

  // Handle loading, empty, and error states
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
      <ErrorBanner
        title={response.errorTitle || 'Request Failed'}
        message={response.error ?? ''}
      />
    </div>
  );

  const renderResponseBody = () =>
    response.error ? renderErrorBanner() : (
      <ResponseBodyTab response={response} selectedFormat={selectedFormat} showPreview={showPreview} />
    );
  const renderHeaders = () => <ResponseHeadersTab headers={response.headers} />;
  const renderTestResults = () => (
    <TestResultsTab 
      testResults={response.testResults} 
      assertionResults={response.assertionResults} 
    />
  );

  // Calculate content indicators
  const headersCount = response.headers ? Object.keys(response.headers).length : 0;
  const hasTestResults = response.testResults && response.testResults.results.length > 0;
  const hasAssertionResults = response.assertionResults && response.assertionResults.results.length > 0;
  const testsCount = hasTestResults || hasAssertionResults ? '•' : undefined;

  const tabs = [
    { 
      id: 'response', 
      label: 'Response', 
      content: renderResponseBody() 
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: headersCount || undefined,
      content: renderHeaders() 
    },
    { 
      id: 'tests', 
      label: 'Tests', 
      contentIndicator: testsCount,
      content: renderTestResults() 
    }
  ];

  const statusInfo = (
    <div className="flex items-center gap-3 flex-wrap text-xs">
      <ResponseFormatSelector
        selectedFormat={selectedFormat}
        handleSelection={(value: ResponseBodyFormat) => handleFormatChange(value)}
        showPreview={showPreview}
        onPreviewToggle={handleViewChange}
      />
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
        <span 
          className="font-mono font-medium"
          style={{
            color: getStatusColor(response.status),
          }}
        >
          {response.status} {response.statusText}
        </span>
      </div>
      
      {response.duration && (
        <div className="flex items-center gap-1">
          <span style={{ color: 'var(--text-secondary)' }}>Time:</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
            {response.duration}ms
          </span>
        </div>
      )}
      
      {response.size && (
        <div className="flex items-center gap-1">
          <span style={{ color: 'var(--text-secondary)' }}>Size:</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
            {(response.size / 1024).toFixed(2)} KB
          </span>
        </div>
      )}
    </div>
  );

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
