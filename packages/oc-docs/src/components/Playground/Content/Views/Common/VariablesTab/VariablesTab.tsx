import React, { useMemo } from 'react';
import type { Variable } from '@opencollection/types/common/variables';
import KeyValueTable, { type KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { InfoTip } from '../../../../../../components/InfoTip/InfoTip';
import { unwrapVariableTyped } from '../../../../../../utils/variableResolution';
import { toDataType } from '../../../../../../utils/variableDataType';
import { VARIABLE_NAME_REGEX } from '../../../../../../constants/regex';
import { variableTypeColumn } from '../VariableTypeControl/variableTypeColumn';
import type { PostResponseVar } from '../../../../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface VariablesTabProps {
  variables: Array<Variable | { name?: string; value?: unknown; disabled?: boolean }>;
  onVariablesChange: (rows: KeyValueRow[]) => void;
  postResponseVars?: PostResponseVar[];
  onPostResponseVarsChange?: (rows: KeyValueRow[]) => void;
  exprHelp?: string;
  title?: string;
  description?: string;
}

const getVariableError = (row: KeyValueRow, _index: number, field: 'name' | 'value'): string | null => {
  if (field !== 'name') return null;
  if (!row.name || row.name.trim() === '') return null;
  if (!VARIABLE_NAME_REGEX.test(row.name)) {
    return 'Variable contains invalid characters. Must only contain alphanumeric characters, "-", "_", "."';
  }
  return null;
};

const dataTypeColumns = [variableTypeColumn];

export const VariablesTab: React.FC<VariablesTabProps> = ({
  variables,
  onVariablesChange,
  postResponseVars,
  onPostResponseVarsChange,
  exprHelp = 'You can write any valid JS expression here',
  title,
  description
}) => {
  const preRequestRows = useMemo<KeyValueRow[]>(
    () =>
      (variables || []).map((variable, index) => {
        const { value, dataType } = unwrapVariableTyped((variable as Variable).value);
        return {
          id: `var-${index}`,
          name: variable.name || '',
          value,
          enabled: !variable.disabled,
          dataType: toDataType(dataType),
          description: (variable as Variable).description,
          originalValue: (variable as Variable).value
        };
      }),
    [variables]
  );

  const postResponseRows = useMemo<KeyValueRow[]>(
    () =>
      (postResponseVars || []).map((variable, index) => ({
        id: `post-var-${index}`,
        name: variable.name || '',
        value: variable.expr || '',
        enabled: !variable.disabled,
        scope: variable.scope,
        description: variable.description
      })),
    [postResponseVars]
  );

  return (
    <StyledWrapper className="space-y-3">
      {(Boolean(title) || Boolean(description)) && (
        <div className="variables-tab-header flex items-center justify-between mb-2">
          {Boolean(title) && <span className="title text-sm font-semibold">{title}</span>}
          {Boolean(description) && <span className="description text-xs leading-tight">{description}</span>}
        </div>
      )}

      <section className="vars-section">
        <h3 className="vars-section-title">Pre Request</h3>
        <KeyValueTable
          testId="variables-pre-request"
          data={preRequestRows}
          onChange={onVariablesChange}
          keyPlaceholder="Name"
          valuePlaceholder="Value"
          showEnabled={true}
          inlineActions={true}
          multilineValues={true}
          additionalColumns={dataTypeColumns}
          getRowError={getVariableError}
        />
      </section>

      {onPostResponseVarsChange && (
        <section className="vars-section">
          <h3 className="vars-section-title">Post Response</h3>
          <KeyValueTable
            testId="variables-post-response"
            data={postResponseRows}
            onChange={onPostResponseVarsChange}
            keyPlaceholder="Name"
            valuePlaceholder="Expr"
            valueHeader={
              <span className="expr-header">
                Expr
                <InfoTip content={exprHelp} testId="post-response-expr-help" />
              </span>
            }
            showEnabled={true}
            inlineActions={true}
            getRowError={getVariableError}
          />
        </section>
      )}
    </StyledWrapper>
  );
};

export default VariablesTab;
