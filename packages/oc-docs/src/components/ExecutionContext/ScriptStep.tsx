import React, { useMemo, useState } from 'react';
import { Code } from '../Code/Code';
import { Chevron } from '../Chevron';
import type { ScriptChainStep } from '../../utils/requestScripts';

interface ScriptStepProps {
  step: ScriptChainStep;
  /** 1-based position of this row in the display order. */
  position: number;
}

/**
 * Split a script into a human-readable description (its leading `//` comment block)
 * and the runnable body shown when the row is expanded. Scripts with no leading
 * comment simply have no description and show their full code.
 */
const splitScript = (code: string): { description?: string; body: string } => {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const comment: string[] = [];
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i += 1;
  while (i < lines.length && lines[i].trim().startsWith('//')) {
    comment.push(lines[i].trim().replace(/^\/\/\s?/, ''));
    i += 1;
  }
  const body = lines.slice(i).join('\n').trim();
  return { description: comment.join(' ').trim() || undefined, body: body || code };
};

/**
 * One script node in the chain: number + chevron + label (+ inherited tag) + a short
 * description, with the source code revealed in a height-animated panel on demand.
 */
export const ScriptStep: React.FC<ScriptStepProps> = ({ step, position }) => {
  const [open, setOpen] = useState(false);
  // Mount the (Prism-highlighted) code lazily on first open, then keep it mounted so
  // the open/close height animation runs without re-highlighting each time.
  const [mounted, setMounted] = useState(false);
  const { description, body } = useMemo(() => splitScript(step.code), [step.code]);

  const toggle = () => {
    if (!open) setMounted(true);
    setOpen((v) => !v);
  };

  return (
    <div className="oc-script-row">
      <div
        className="oc-script-line oc-script-step-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <span className="oc-step-num">{position}</span>
        <Chevron open={open} className="oc-script-chevron" />
        <span className="oc-script-label-cell">
          <span className="oc-script-step-label">{step.label}</span>
          {step.inherited && <span className="oc-script-inherited-tag">inherited</span>}
        </span>
        <span className="oc-script-desc">{description}</span>
        <button
          type="button"
          className="oc-code-toggle"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          {open ? 'hide code' : 'view code'}
        </button>
      </div>

      <div className={`oc-script-code${open ? ' is-open' : ''}`}>
        <div className="oc-script-code-clip">
          {mounted && (
            <div className="oc-script-code-inner">
              <Code code={body} language="javascript" showLineNumbers showCopy />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptStep;
