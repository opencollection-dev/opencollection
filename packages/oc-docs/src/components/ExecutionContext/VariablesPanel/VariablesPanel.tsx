import React from 'react';
import { PropertyTable, type PropertyRow } from '../../PropertyTable/PropertyTable';
import { SubHeading } from '../../SubHeading/SubHeading';
import type { PreRequestVarRow, PostResponseVarRow } from '../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface VariablesPanelProps {
  preVars: PreRequestVarRow[];
  postVars: PostResponseVarRow[];
  variant?: 'grid' | 'stacked';
}

const preRows = (vars: PreRequestVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.value, type: v.type, disabled: v.disabled }));

const postRows = (vars: PostResponseVarRow[]): PropertyRow[] =>
  vars.map((v) => ({ label: v.name, value: v.expression, disabled: v.disabled }));

const Field: React.FC<{ label: string; rows: PropertyRow[] }> = ({ label, rows }) => (
  <div className="vars-field">
    <SubHeading as="h4" className="vars-field-label">{label}</SubHeading>
    <PropertyTable rows={rows} emptyMessage="None." className="vars-table" />
  </div>
);

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ preVars, postVars, variant = 'grid' }) => {
  if (preVars.length === 0 && postVars.length === 0) return null;

  const stacked = variant === 'stacked';
  const showPre = !stacked || preVars.length > 0;
  const showPost = !stacked || postVars.length > 0;

  return (
    <StyledWrapper className={stacked ? 'vars-grid vars-stacked' : 'vars-grid'}>
      {showPre && <Field label="Pre-Request" rows={preRows(preVars)} />}
      {showPost && <Field label="Post-Response" rows={postRows(postVars)} />}
    </StyledWrapper>
  );
};

export default VariablesPanel;
