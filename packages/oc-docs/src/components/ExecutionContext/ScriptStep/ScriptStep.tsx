import React, { useState } from 'react';
import { Code } from '../../Code/Code';
import { ChevronArrow } from '../../ChevronArrow/ChevronArrow';
import { Collapse } from '../../../ui/Collapse/Collapse';
import type { ScriptChainStep } from '../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface ScriptStepProps {
  step: ScriptChainStep;
  /** 1-based position of this step within the displayed chain. */
  position: number;
}

/** One numbered step in the script-execution chain; click/Enter/Space reveals its source. */
export const ScriptStep: React.FC<ScriptStepProps> = ({ step, position }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <StyledWrapper className="script-row">
      <div
        className="script-line script-step-head"
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
        <span className="step-num">{position}</span>
        <ChevronArrow open={open} className="script-chevron" />
        <span className="script-step-label">{step.label}</span>
        <button
          type="button"
          className="code-toggle"
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
        <div className="script-code-inner">
          <Code code={step.code} language="javascript" surface="muted" showLineNumbers showCopy />
        </div>
      </Collapse>
    </StyledWrapper>
  );
};

export default ScriptStep;
