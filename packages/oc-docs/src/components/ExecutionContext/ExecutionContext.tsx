import React from 'react';
import { Tabs, type TabItem } from '../../ui/Tabs/Tabs';
import { ScriptChain } from './ScriptChain/ScriptChain';
import { VariablesPanel } from './VariablesPanel/VariablesPanel';
import { AssertList } from './AssertList/AssertList';
import { TestList } from './TestList/TestList';
import { ViewAllTests } from './ViewAllTests/ViewAllTests';
import { StyledWrapper } from './StyledWrapper';
import type { ScriptChainStep, ScriptFlow, PreRequestVarRow, PostResponseVarRow } from '../../utils/request';
import type { AssertionRow } from '../../utils/assertions';
import type { TestRow, RawTestScript } from '../../utils/fileUtils';

interface ExecutionContextProps {
  scriptChain: ScriptChainStep[];
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
  assertions: AssertionRow[];
  tests: TestRow[];
  testScripts?: RawTestScript[];
  flow?: ScriptFlow;
  method?: string;
  url?: string;
  variant?: 'tabs' | 'docs';
  className?: string;
  testId?: string;
  onNavigate?: (uuid: string) => void;
}

const FLOW_LABEL: Record<ScriptFlow, string> = { sandwich: 'Sandwich', sequential: 'Sequential' };

const Card: React.FC<{
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  boxClassName?: string;
  testId?: string;
}> = ({ title, meta, children, boxClassName, testId }) => (
  <div className="exec-card" data-testid={testId}>
    <div className="exec-card-head">
      <span className="exec-card-title" data-testid={testId ? `${testId}-title` : undefined}>{title}</span>
      {meta !== undefined && <span className="exec-card-meta">{meta}</span>}
    </div>
    <div className={['exec-card-box', boxClassName].filter(Boolean).join(' ')}>{children}</div>
  </div>
);

export const ExecutionContext: React.FC<ExecutionContextProps> = ({
  scriptChain,
  preVars,
  postVars,
  assertions,
  tests,
  testScripts = [],
  flow = 'sandwich',
  method,
  url,
  variant = 'tabs',
  className,
  testId = 'execution-context',
  onNavigate
}) => {
  const hasScripts = scriptChain.length > 0;
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasAsserts = assertions.length > 0;
  const hasTests = tests.length > 0;

  if (!hasScripts && !hasVars && !hasAsserts && !hasTests) return null;

  const flowIndicator = hasScripts ? (
    <span className="exec-flow" data-testid="execution-context-flow">{FLOW_LABEL[flow]} execution flow</span>
  ) : undefined;

  const scripts = <ScriptChain steps={scriptChain} flow={flow} method={method} url={url} onNavigate={onNavigate} />;
  const variables = <VariablesPanel preVars={preVars} postVars={postVars} />;
  const asserts = <AssertList assertions={assertions} />;
  const testCases = <TestList tests={tests} />;

  if (variant === 'docs') {
    return (
      <StyledWrapper className={['execution-context', className].filter(Boolean).join(' ')} data-testid={testId}>
        {hasScripts && <Card title="Scripts" testId="execution-context-scripts" meta={flowIndicator}>{scripts}</Card>}
        {hasVars && (
          <Card title="Variables" testId="execution-context-variables" boxClassName="exec-card-box--bare">{variables}</Card>
        )}
        {hasAsserts && <Card title="Asserts" testId="execution-context-asserts">{asserts}</Card>}
        {hasTests && (
          <Card
            title="Tests"
            testId="execution-context-tests"
            meta={<ViewAllTests scripts={testScripts} testId="execution-context-view-complete-code" />}
          >
            {testCases}
          </Card>
        )}
      </StyledWrapper>
    );
  }

  const tabs: TabItem[] = [];
  if (hasVars) {
    tabs.push({
      id: 'variables',
      label: 'Variables',
      count: preVars.length + postVars.length,
      content: <div data-testid="execution-context-variables">{variables}</div>
    });
  }
  if (hasScripts) {
    tabs.push({
      id: 'scripts',
      label: 'Scripts',
      count: scriptChain.length,
      rightElement: flowIndicator,
      content: <div className="exec-card-box" data-testid="execution-context-scripts">{scripts}</div>
    });
  }
  if (hasAsserts) {
    tabs.push({
      id: 'asserts',
      label: 'Asserts',
      count: assertions.length,
      content: <div className="exec-card-box" data-testid="execution-context-asserts">{asserts}</div>
    });
  }
  if (hasTests) {
    tabs.push({
      id: 'tests',
      label: 'Tests',
      count: tests.length,
      rightElement: <ViewAllTests scripts={testScripts} testId="execution-context-view-complete-code" />,
      content: <div className="exec-card-box" data-testid="execution-context-tests">{testCases}</div>
    });
  }

  return (
    <StyledWrapper className={['execution-context', className].filter(Boolean).join(' ')} data-testid={testId}>
      <Tabs tabs={tabs} ariaLabel="Execution context" testId="execution-context-tabs" />
    </StyledWrapper>
  );
};

export default ExecutionContext;
