import React from 'react';
import { PropertyTable, type PropertyRow } from '../../PropertyTable/PropertyTable';
import { SubHeading } from '../../SubHeading/SubHeading';
import type { PreRequestVarRow, PostResponseVarRow } from '../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface VariablesPanelProps {
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
}

const preRows = (vars: PreRequestVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.value, disabled: v.disabled }));

const postRows = (vars: PostResponseVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.expression, disabled: v.disabled }));

const Field: React.FC<{ label: string; rows: PropertyRow[] }> = ({ label, rows }) => (
  <div className="vars-field">
    <SubHeading as="h4" className="vars-field-label">{label}</SubHeading>
    <PropertyTable rows={rows} emptyMessage="None." className="vars-table" />
  </div>
);

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ preVars, postVars }) => {
  if (preVars.length === 0 && postVars.length === 0) return null;

  return (
    <StyledWrapper className="vars-grid">
      <Field label="Pre-Request" rows={preRows(preVars)} />
      <Field label="Post Response" rows={postRows(postVars)} />
    </StyledWrapper>
  );
};

export default VariablesPanel;
