import React from 'react';
import type { ScriptFlow } from '../../utils/requestScripts';

interface FlowToggleProps {
  value: ScriptFlow;
  onChange: (flow: ScriptFlow) => void;
}

const FLOW_LABEL: Record<ScriptFlow, string> = {
  sandwich: 'Sandwich',
  sequential: 'Sequential'
};

/**
 * Pill in the Scripts header showing the active execution flow. Activating it
 * toggles between the two flows (the ordering logic itself is unchanged); it is a
 * single button so the keyboard interaction is the standard activate-to-switch.
 */
export const FlowToggle: React.FC<FlowToggleProps> = ({ value, onChange }) => {
  const next: ScriptFlow = value === 'sandwich' ? 'sequential' : 'sandwich';

  return (
    <button
      type="button"
      className="oc-flow-toggle"
      aria-label={`${FLOW_LABEL[value]} execution flow. Activate to switch to ${FLOW_LABEL[next].toLowerCase()}.`}
      title={`Switch to ${FLOW_LABEL[next].toLowerCase()} execution flow`}
      onClick={() => onChange(next)}
    >
      {FLOW_LABEL[value]} execution flow
    </button>
  );
};

export default FlowToggle;
