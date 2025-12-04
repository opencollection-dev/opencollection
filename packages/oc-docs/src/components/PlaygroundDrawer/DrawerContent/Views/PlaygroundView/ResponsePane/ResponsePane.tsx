import React, { useState } from 'react';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { ResponseBodyTab, ResponseHeadersTab, TestResultsTab } from '../../Common';

interface ResponsePaneProps {
  response: any;
  isLoading: boolean;
}

const ResponsePane: React.FC<ResponsePaneProps> = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState('response');

  const getStatusColor = (status?: number) => {
    if (!status) return '#6b7280';
    if (status >= 200 && status < 300) return 'rgb(29 122 91)';
    if (status >= 300 && status < 400) return 'rgb(234 179 8)';
    if (status >= 400 && status < 500) return 'rgb(239 68 68)';
    if (status >= 500) return 'rgb(220 38 38)';
    return 'rgb(107 114 128)';
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

  if (response.error) {
    return (
      <div className="h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="p-4">
          <div className="p-4 rounded border-l-4 border-red-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="text-lg font-medium text-red-600 mb-2">Request Failed</h3>
            <p style={{ color: 'var(--text-primary)' }}>{response.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderResponseBody = () => <ResponseBodyTab response={response} />;
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
    <div className="h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightElement={statusInfo}
      />
    </div>
  );
};

export default ResponsePane;
