import React from 'react';
import { PropertyTable, type PropertyRow } from '../PropertyTable';
import type { PreRequestVarRow, PostResponseVarRow } from '../../utils/requestVars';

interface VariablesPanelProps {
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
}

const preRows = (vars: PreRequestVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.value, disabled: v.disabled }));

const postRows = (vars: PostResponseVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.expression, disabled: v.disabled }));

const Field: React.FC<{ label: string; rows: PropertyRow[] }> = ({ label, rows }) => (
  <div className="oc-vars-field">
    <div className="oc-vars-field-label">{label}</div>
    {rows.length > 0 ? <PropertyTable rows={rows} /> : <div className="oc-vars-none">None.</div>}
  </div>
);

/** Pre-request variables and post-response captures, side by side as key/value tables. */
export const VariablesPanel: React.FC<VariablesPanelProps> = ({ preVars, postVars }) => {
  if (preVars.length === 0 && postVars.length === 0) return null;

  return (
    <div className="oc-vars-grid">
      <Field label="Pre-Request" rows={preRows(preVars)} />
      <Field label="Post-Response" rows={postRows(postVars)} />
    </div>
  );
};

export default VariablesPanel;
