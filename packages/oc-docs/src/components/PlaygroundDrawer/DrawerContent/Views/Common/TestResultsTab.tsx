import React, { useState } from 'react';
import type { TestResultsResponse, AssertionResultsResponse } from '../../../../../runner';

interface TestResultsTabProps {
  testResults?: TestResultsResponse;
  assertionResults?: AssertionResultsResponse;
}

const TestResultsTab: React.FC<TestResultsTabProps> = ({ testResults, assertionResults }) => {
  const [testsExpanded, setTestsExpanded] = useState(true);
  const [assertionsExpanded, setAssertionsExpanded] = useState(true);
  
  const hasTests = testResults && testResults.results.length > 0;
  const hasAssertions = assertionResults && assertionResults.results.length > 0;

  if (!hasTests && !hasAssertions) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            <svg fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>No tests or assertions were run</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        );
      case 'fail':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        );
      case 'skip':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 7l5 5-5 5M7 7l-5 5 5 5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'rgb(34 197 94)'; // green-500
      case 'fail':
        return 'rgb(239 68 68)'; // red-500
      case 'skip':
        return 'rgb(156 163 175)'; // gray-400
      default:
        return 'var(--text-secondary)';
    }
  };

  const renderSectionHeader = (
    title: string,
    summary: { total: number; passed: number; failed: number; skipped: number },
    isExpanded: boolean,
    onToggle: () => void
  ) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s'
        }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span>
        {title} ({summary.total}), Passed: {summary.passed}, Failed: {summary.failed}
      </span>
    </button>
  );

  return (
    <div className="h-full overflow-auto">
      <div className="py-3 space-y-3">
        {/* Tests Section */}
        {hasTests && (
          <div>
            {renderSectionHeader('Tests', testResults.summary, testsExpanded, () => setTestsExpanded(!testsExpanded))}
            {testsExpanded && (
              <div className="mt-2 space-y-2">
                {testResults.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 px-3 py-2"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                    }}
                  >
                    <div style={{ color: getStatusColor(result.status), flexShrink: 0, marginTop: '2px' }}>
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {result.description}
                      </div>
                      {result.error && (
                        <div className="text-xs mt-1 font-mono" style={{ 
                          color: 'rgb(239 68 68)',
                        }}>
                          {result.error}
                        </div>
                      )}
                      {result.expected !== undefined && result.actual !== undefined && (
                        <div className="text-xs mt-2 space-y-1">
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Expected: </span>
                            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                              {JSON.stringify(result.expected)}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Actual: </span>
                            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                              {JSON.stringify(result.actual)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assertions Section */}
        {hasAssertions && (
          <div>
            {renderSectionHeader('Assertions', assertionResults.summary, assertionsExpanded, () => setAssertionsExpanded(!assertionsExpanded))}
            {assertionsExpanded && (
              <div className="mt-2 space-y-2">
                {assertionResults.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 px-3 py-2"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                    }}
                  >
                    <div style={{ color: getStatusColor(result.status), flexShrink: 0, marginTop: '2px' }}>
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                          {result.lhsExpr}
                        </span>
                        {result.operator && (
                          <>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {result.operator}
                            </span>
                            {result.rhsOperand !== undefined && (
                              <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                                {JSON.stringify(result.rhsOperand)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {result.error && (
                        <div className="text-xs mt-1 font-mono" style={{ color: 'rgb(239 68 68)' }}>
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultsTab;

