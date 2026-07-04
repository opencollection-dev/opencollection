import React from 'react';
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
  className,
  testId = 'execution-context',
  onNavigate
}) => {
  const hasScripts = scriptChain.length > 0;
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasAsserts = assertions.length > 0;
  const hasTests = tests.length > 0;

  if (!hasScripts && !hasVars && !hasAsserts && !hasTests) return null;

  return (
    <StyledWrapper className={['execution-context', className].filter(Boolean).join(' ')} data-testid={testId}>
      {hasScripts && (
        <Card title="Scripts" testId="execution-context-scripts" meta={<span className="exec-flow">{FLOW_LABEL[flow]} execution flow</span>}>
          <ScriptChain steps={scriptChain} flow={flow} method={method} url={url} onNavigate={onNavigate} />
        </Card>
      )}
      {hasVars && (
        <Card title="Variables" testId="execution-context-variables" boxClassName="exec-card-box--bare">
          <VariablesPanel preVars={preVars} postVars={postVars} />
        </Card>
      )}
      {hasAsserts && (
        <Card title="Asserts" testId="execution-context-asserts">
          <AssertList assertions={assertions} />
        </Card>
      )}
      {hasTests && (
        <Card title="Tests" testId="execution-context-tests" meta={<ViewAllTests scripts={testScripts} />}>
          <TestList tests={tests} />
        </Card>
      )}
    </StyledWrapper>
  );
};

export default ExecutionContext;
