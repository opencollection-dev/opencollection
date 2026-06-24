import React from 'react';
import { PropertyTable, type PropertyRow } from '../PropertyTable';
import { SubHeading } from '../SubHeading/SubHeading';
import type { PreRequestVarRow, PostResponseVarRow } from '../../utils/requestVars';

interface VariablesPanelProps {
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
}

const preRows = (vars: PreRequestVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.value, disabled: v.disabled }));

const postRows = (vars: PostResponseVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.expression, disabled: v.disabled }));

// Label floats ABOVE its value box, using the shared SubHeading (the same #9B9B9B
// group-title used for Path / Query / Headers); a scoped className keeps the panel's
// uppercase styling without touching SubHeading's other usages. Both columns share the
// same table so an empty "None." column stays the same size as a populated one.
const Field: React.FC<{ label: string; rows: PropertyRow[] }> = ({ label, rows }) => (
  <div className="oc-vars-field">
    <SubHeading as="h4" className="oc-vars-field-label">{label}</SubHeading>
    <PropertyTable rows={rows} emptyMessage="None." className="oc-vars-table" />
  </div>
);

/** Pre-request variables and post-response captures, side by side as key/value tables. */
export const VariablesPanel: React.FC<VariablesPanelProps> = ({ preVars, postVars }) => {
  if (preVars.length === 0 && postVars.length === 0) return null;

  return (
    <div className="oc-vars-grid">
      <Field label="Pre-Request" rows={preRows(preVars)} />
      <Field label="Post Response" rows={postRows(postVars)} />
    </div>
  );
};

export default VariablesPanel;
