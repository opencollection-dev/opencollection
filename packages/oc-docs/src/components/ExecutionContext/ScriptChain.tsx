import React, { useMemo } from 'react';
import { VariableText } from '../VariableText';
import { ScriptStep } from './ScriptStep';
import type { ScriptChainStep, ScriptFlow } from '../../utils/requestScripts';

interface ScriptChainProps {
  steps: ScriptChainStep[];
  /** Active execution flow; controls post-response ordering. */
  flow: ScriptFlow;
  /** Method/url for the synthetic "HTTP" execution marker, if known. */
  method?: string;
  url?: string;
}

/** The synthetic row marking where the HTTP request is actually sent. */
const HttpMarker: React.FC<{ position: number; url?: string }> = ({ position, url }) => (
  <div className="oc-script-row oc-script-row--marker">
    <div className="oc-script-line oc-script-http">
      <span className="oc-step-num">{position}</span>
      <span aria-hidden="true" />
      <span className="oc-script-http-label">HTTP</span>
      <span className="oc-script-http-url">{url ? <VariableText value={url} /> : null}</span>
      <span aria-hidden="true" />
    </div>
  </div>
);

/**
 * The ordered script-execution chain rendered as rows: pre-request scripts run
 * first (collection → folders → request), then the request is sent (the "HTTP"
 * marker), then post-response scripts run in an order that depends on `flow` —
 * innermost→outermost for `sandwich`, outermost→innermost for `sequential`. Rows
 * are numbered 1..N across both kinds in display order.
 */
export const ScriptChain: React.FC<ScriptChainProps> = ({ steps, flow, url }) => {
  // Pre-request order is the same for both flows; only post-response ordering
  // differs, so we sort by hierarchy index and reverse for the sandwich flow.
  const { pre, post } = useMemo(() => {
    const byOrderAsc = (a: ScriptChainStep, b: ScriptChainStep) => a.order - b.order;
    const preSteps = steps.filter((s) => s.phase === 'before-request').sort(byOrderAsc);
    const postSteps = steps.filter((s) => s.phase === 'after-response').sort(byOrderAsc);
    return { pre: preSteps, post: flow === 'sandwich' ? postSteps.reverse() : postSteps };
  }, [steps, flow]);

  if (steps.length === 0) return null;

  let position = 0;
  const next = (): number => (position += 1);

  return (
    <>
      {pre.map((step, index) => (
        <ScriptStep key={`pre-${step.order}-${index}`} step={step} position={next()} />
      ))}
      <HttpMarker position={next()} url={url} />
      {post.map((step, index) => (
        <ScriptStep key={`post-${step.order}-${index}`} step={step} position={next()} />
      ))}
    </>
  );
};

export default ScriptChain;
