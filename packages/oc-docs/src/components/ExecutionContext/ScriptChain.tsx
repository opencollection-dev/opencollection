import React, { useMemo } from 'react';
import { VariableText } from '../VariableText/VariableText';
import { ScriptStep } from './ScriptStep';
import type { ScriptChainStep, ScriptFlow } from '../../utils/requestScripts';

interface ScriptChainProps {
  steps: ScriptChainStep[];
  flow: ScriptFlow;
  method?: string;
  url?: string;
}

const HttpMarker: React.FC<{ position: number; url?: string }> = ({ position, url }) => (
  <div className="oc-script-row oc-script-row--marker">
    <div className="oc-script-line oc-script-http">
      <span className="oc-step-num">{position}</span>
      <span aria-hidden="true" />
      <span className="oc-script-http-main">
        <span className="oc-script-http-label">HTTP</span>
        {url && (
          <span className="oc-script-http-url">
            <VariableText value={url} />
          </span>
        )}
      </span>
      <span aria-hidden="true" />
    </div>
  </div>
);

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
