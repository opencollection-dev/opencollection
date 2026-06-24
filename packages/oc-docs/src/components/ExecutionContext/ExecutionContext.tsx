import React from 'react';
import { ScriptChain } from './ScriptChain';
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
  /** Script execution flow (from `extensions.config.scripts.flow`). Defaults to `sandwich`. */
  flow?: ScriptFlow;
  /** Method/url shown on the synthetic "HTTP" row in the script chain. */
  method?: string;
  url?: string;
  className?: string;
}

const countLabel = (n: number, noun: string): string => `${n} ${noun}${n === 1 ? '' : 's'}`;
const FLOW_LABEL: Record<ScriptFlow, string> = { sandwich: 'Sandwich', sequential: 'Sequential' };

/**
 * A titled section inside the Execution Context: the title (+ optional meta) sits
 * ABOVE a bordered content box. Not individually collapsible — the whole Execution
 * Context collapses as one (see the page's collapsible `Section`).
 */
const Card: React.FC<{
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  /** Extra class on the content box (e.g. `oc-exec-card-box--bare` to drop the frame). */
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

  const varCount = preVars.length + postVars.length;

  return (
    <ExecutionContextWrapper className={['oc-execution-context', className].filter(Boolean).join(' ')}>
      {hasScripts && (
        <Card title="Scripts" meta={<span className="oc-exec-flow">{FLOW_LABEL[flow]} execution flow</span>}>
          <ScriptChain steps={scriptChain} flow={flow} method={method} url={url} />
        </Card>
      )}
      {hasVars && (
        <Card title="Variables" meta={countLabel(varCount, 'var')} boxClassName="oc-exec-card-box--bare">
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
