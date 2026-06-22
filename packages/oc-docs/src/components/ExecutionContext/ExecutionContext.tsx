import React, { useState } from 'react';
import { ScriptChain } from './ScriptChain';
import { FlowToggle } from './FlowToggle';
import { VariablesPanel } from './VariablesPanel';
import { AssertList } from './AssertList';
import { TestList } from './TestList';
import { ExecutionContextWrapper } from './StyledWrapper';
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
  /** Method/url shown on the synthetic "Request Execution" row in the script chain. */
  method?: string;
  url?: string;
  /** Initial script execution flow. Defaults to `sandwich`. */
  defaultFlow?: ScriptFlow;
  className?: string;
}

const countLabel = (n: number, noun: string): string => `${n} ${noun}${n === 1 ? '' : 's'}`;

/**
 * A titled section card inside the Execution Context. These are not individually
 * collapsible — the whole Execution Context collapses as one (see the page's
 * collapsible `Section`); each card just groups a title + optional meta + content.
 */
const Card: React.FC<{ title: string; meta?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  meta,
  children
}) => (
  <div className="oc-exec-card">
    <div className="oc-exec-card-head">
      <span className="oc-exec-card-title">{title}</span>
      {meta !== undefined && <span className="oc-exec-card-meta">{meta}</span>}
    </div>
    {children}
  </div>
);

/**
 * Execution context for a request: the ordered script chain, pre/post variables,
 * defined asserts and tests — each in its own bordered card. Purely presentational
 * (static documentation, not a run). Renders nothing when every group is empty.
 */
export const ExecutionContext: React.FC<ExecutionContextProps> = ({
  scriptChain,
  preVars,
  postVars,
  assertions,
  tests,
  method,
  url,
  defaultFlow = 'sandwich',
  className
}) => {
  const [flow, setFlow] = useState<ScriptFlow>(defaultFlow);

  const hasScripts = scriptChain.length > 0;
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasAsserts = assertions.length > 0;
  const hasTests = tests.length > 0;

  if (!hasScripts && !hasVars && !hasAsserts && !hasTests) return null;

  const varCount = preVars.length + postVars.length;

  return (
    <ExecutionContextWrapper className={['oc-execution-context', className].filter(Boolean).join(' ')}>
      {hasScripts && (
        <Card title="Scripts" meta={<FlowToggle value={flow} onChange={setFlow} />}>
          <ScriptChain steps={scriptChain} flow={flow} method={method} url={url} />
        </Card>
      )}
      {hasVars && (
        <Card title="Variables" meta={countLabel(varCount, 'var')}>
          <VariablesPanel preVars={preVars} postVars={postVars} />
        </Card>
      )}
      {hasAsserts && (
        <Card title="Asserts" meta={countLabel(assertions.length, 'assert')}>
          <AssertList assertions={assertions} />
        </Card>
      )}
      {hasTests && (
        <Card title="Tests" meta={countLabel(tests.length, 'test')}>
          <TestList tests={tests} />
        </Card>
      )}
    </ExecutionContextWrapper>
  );
};

export default ExecutionContext;
