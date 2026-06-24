import React from 'react';
import { ScriptChain } from './ScriptChain';
import { VariablesPanel } from './VariablesPanel';
import { AssertList } from './AssertList';
import { TestList } from './TestList';
import { ViewAllTests } from './ViewAllTests';
import { StyledWrapper } from './StyledWrapper';
import type { ScriptChainStep, ScriptFlow } from '../../utils/requestScripts';
import type { PreRequestVarRow, PostResponseVarRow } from '../../utils/requestVars';
import type { AssertionRow } from '../../utils/assertions';
import type { TestRow } from '../../utils/extractTests';

interface ExecutionContextProps {
  scriptChain: ScriptChainStep[];
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
  assertions: AssertionRow[];
  tests: TestRow[];
  flow?: ScriptFlow;
  method?: string;
  url?: string;
  className?: string;
}

const FLOW_LABEL: Record<ScriptFlow, string> = { sandwich: 'Sandwich', sequential: 'Sequential' };

const Card: React.FC<{
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  boxClassName?: string;
}> = ({ title, meta, children, boxClassName }) => (
  <div className="oc-exec-card">
    <div className="oc-exec-card-head">
      <span className="oc-exec-card-title">{title}</span>
      {meta !== undefined && <span className="oc-exec-card-meta">{meta}</span>}
    </div>
    <div className={['oc-exec-card-box', boxClassName].filter(Boolean).join(' ')}>{children}</div>
  </div>
);

export const ExecutionContext: React.FC<ExecutionContextProps> = ({
  scriptChain,
  preVars,
  postVars,
  assertions,
  tests,
  flow = 'sandwich',
  method,
  url,
  className
}) => {
  const hasScripts = scriptChain.length > 0;
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasAsserts = assertions.length > 0;
  const hasTests = tests.length > 0;

  if (!hasScripts && !hasVars && !hasAsserts && !hasTests) return null;

  return (
    <StyledWrapper className={['oc-execution-context', className].filter(Boolean).join(' ')}>
      {hasScripts && (
        <Card title="Scripts" meta={<span className="oc-exec-flow">{FLOW_LABEL[flow]} execution flow</span>}>
          <ScriptChain steps={scriptChain} flow={flow} method={method} url={url} />
        </Card>
      )}
      {hasVars && (
        <Card title="Variables" boxClassName="oc-exec-card-box--bare">
          <VariablesPanel preVars={preVars} postVars={postVars} />
        </Card>
      )}
      {hasAsserts && (
        <Card title="Asserts">
          <AssertList assertions={assertions} />
        </Card>
      )}
      {hasTests && (
        <Card title="Tests" meta={<ViewAllTests tests={tests} />}>
          <TestList tests={tests} />
        </Card>
      )}
    </StyledWrapper>
  );
};

export default ExecutionContext;
