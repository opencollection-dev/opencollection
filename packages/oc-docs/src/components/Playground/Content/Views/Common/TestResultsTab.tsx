import React from 'react';
import styled from '@emotion/styled';
import type { TestResultsResponse, AssertionResultsResponse } from '../../../../../runner';

interface TestResultsTabProps {
  testResults?: TestResultsResponse;
  assertionResults?: AssertionResultsResponse;
}

const Wrapper = styled.div`
  .test-summary {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .test-card {
    border: 1px solid var(--border-color);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }

  .test-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.5rem 0.875rem;
  }

  .test-row + .test-row {
    border-top: 1px solid var(--border-color);
  }

  .test-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    flex-shrink: 0;
    margin-top: 0.4rem;
  }

  .test-body {
    flex: 1;
    min-width: 0;
  }

  .test-desc {
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .test-detail {
    margin-top: 0.25rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-secondary);
    word-break: break-word;
  }

  .test-status {
    flex-shrink: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
`;

const statusColor = (status: string): string => {
  if (status === 'pass') return 'var(--oc-colors-text-green)';
  if (status === 'fail') return 'var(--oc-colors-text-danger)';
  return 'var(--oc-colors-text-muted)';
};

interface TestRow {
  status: string;
  description: string;
  detail?: string;
}

const TestResultsTab: React.FC<TestResultsTabProps> = ({ testResults, assertionResults }) => {
  const hasTests = testResults && testResults.results.length > 0;
  const hasAssertions = assertionResults && assertionResults.results.length > 0;

  if (!hasTests && !hasAssertions) {
    return (
      <div className="py-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        No tests or assertions were run
      </div>
    );
  }

  const rows: TestRow[] = [];

  if (hasTests) {
    testResults.results.forEach((result) => {
      const detail =
        result.error ??
        (result.expected !== undefined && result.actual !== undefined
          ? `Expected ${JSON.stringify(result.expected)}, got ${JSON.stringify(result.actual)}`
          : undefined);
      rows.push({ status: result.status, description: result.description, detail });
    });
  }

  if (hasAssertions) {
    assertionResults.results.forEach((result) => {
      const description = [
        result.lhsExpr,
        result.operator,
        result.rhsOperand !== undefined ? JSON.stringify(result.rhsOperand) : undefined
      ]
        .filter(Boolean)
        .join(' ');
      rows.push({ status: result.status, description, detail: result.error });
    });
  }

  const passed = (testResults?.summary.passed ?? 0) + (assertionResults?.summary.passed ?? 0);
  const failed = (testResults?.summary.failed ?? 0) + (assertionResults?.summary.failed ?? 0);
  const skipped = (testResults?.summary.skipped ?? 0) + (assertionResults?.summary.skipped ?? 0);

  return (
    <Wrapper className="py-4 space-y-3">
      <div className="test-summary">
        <span style={{ color: 'var(--oc-colors-text-green)' }}>{passed} passed</span>
        <span style={{ color: 'var(--oc-colors-text-danger)' }}>{failed} failed</span>
        {skipped > 0 && <span style={{ color: 'var(--oc-colors-text-muted)' }}>{skipped} skipped</span>}
      </div>

      <div className="test-card">
        {rows.map((row, index) => (
          <div key={index} className="test-row">
            <span className="test-dot" style={{ backgroundColor: statusColor(row.status) }} />
            <div className="test-body">
              <div className="test-desc">{row.description}</div>
              {row.detail && <div className="test-detail">{row.detail}</div>}
            </div>
            <span className="test-status" style={{ color: statusColor(row.status) }}>
              {row.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default TestResultsTab;
