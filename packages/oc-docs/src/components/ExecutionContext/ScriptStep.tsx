import React, { useState } from 'react';
import { Code } from '../Code/Code';
import { Chevron } from '../Chevron';
import { Collapse } from '../Collapse';
import type { ScriptChainStep } from '../../utils/requestScripts';

interface ScriptStepProps {
  step: ScriptChainStep;
  /** 1-based position of this row in the display order. */
  position: number;
}

/**
 * One script node in the chain: number + chevron + level/phase label, with the
 * script's source code revealed in a height-animated panel on demand. Only the
 * label and the code are shown — both come straight from the collection.
 */
export const ScriptStep: React.FC<ScriptStepProps> = ({ step, position }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

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
        <span className="oc-script-step-label">{step.label}</span>
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

      <Collapse open={open} lazy>
        <div className="oc-script-code-inner">
          <Code code={step.code} language="javascript" showLineNumbers showCopy />
        </div>
      </Collapse>
    </div>
  );
};

export default ScriptStep;
