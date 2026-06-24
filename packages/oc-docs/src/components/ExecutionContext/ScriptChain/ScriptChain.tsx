import React, { useMemo } from 'react';
import { VariableText } from '../../VariableText/VariableText';
import { ScriptStep } from '../ScriptStep/ScriptStep';
import type { ScriptChainStep, ScriptFlow } from '../../../utils/requestScripts';
import { StyledWrapper } from './StyledWrapper';

interface ScriptChainProps {
  steps: ScriptChainStep[];
  flow: ScriptFlow;
  method?: string;
  url?: string;
}

/** The synthetic row marking where the HTTP request is sent, between pre and post steps. */
const HttpMarker: React.FC<{ position: number; url?: string }> = ({ position, url }) => (
  <div className="script-row script-row--marker">
    <div className="script-line script-http">
      <span className="step-num">{position}</span>
      <span aria-hidden="true" />
      <span className="script-http-main">
        <span className="script-http-label">HTTP</span>
        {url && (
          <span className="script-http-url">
            <VariableText value={url} />
          </span>
        )}
      </span>
      <span aria-hidden="true" />
    </div>
  </div>
);

/**
 * The ordered script-execution chain: pre-request steps run collection → folder →
 * request, then the HTTP marker, then post-response steps. `sandwich` flow reverses
 * the post-response order (innermost → outermost); `sequential` keeps it. Rows are
 * numbered 1..N in display order.
 */
export const ScriptChain: React.FC<ScriptChainProps> = ({ steps, flow, url }) => {
  const { pre, post } = useMemo(() => {
    const byOrderAsc = (a: ScriptChainStep, b: ScriptChainStep) => a.order - b.order;
    const pre = steps.filter((s) => s.phase === 'before-request').sort(byOrderAsc);
    const postAsc = steps.filter((s) => s.phase === 'after-response').sort(byOrderAsc);
    const post = flow === 'sequential' ? postAsc : [...postAsc].reverse();
    return { pre, post };
  }, [steps, flow]);

  if (steps.length === 0) return null;

  let position = 0;
  const next = (): number => (position += 1);

  return (
    <StyledWrapper>
      {pre.map((step, index) => (
        <ScriptStep key={`pre-${step.order}-${index}`} step={step} position={next()} />
      ))}
      <HttpMarker position={next()} url={url} />
      {post.map((step, index) => (
        <ScriptStep key={`post-${step.order}-${index}`} step={step} position={next()} />
      ))}
    </StyledWrapper>
  );
};

export default ScriptChain;
