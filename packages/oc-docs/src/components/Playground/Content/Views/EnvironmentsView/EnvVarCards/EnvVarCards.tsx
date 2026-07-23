import React from 'react';
import { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { SecretValue } from '../../../../../../ui/SecretValue/SecretValue';
import { TrashIcon } from '../../../../../../assets/icons';
import { useEditableRows } from '../../../../../../hooks/useEditableRows';
import { cx } from '../../../../../../utils/cx';
import { toDataType } from '../../../../../../utils/variableDataType';
import { VariableTypeControl } from '../../Common/VariableTypeControl/VariableTypeControl';
import { StyledWrapper } from './StyledWrapper';
import Checkbox from '../../../../../../ui/Checkbox/Checkbox';

interface EnvVarCardsProps {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  makeNewRow?: () => Partial<KeyValueRow>;
  disableNewRow?: boolean;
  editableDataType?: boolean;
  secretEditByDefault?: boolean;
  addWhenComplete?: boolean;
  testId?: string;
}

const EnvVarCards: React.FC<EnvVarCardsProps> = ({
  rows: data,
  onChange,
  makeNewRow,
  disableNewRow = false,
  editableDataType = false,
  secretEditByDefault = false,
  addWhenComplete = false,
  testId
}) => {
  const { rows, updateRow, removeRow } = useEditableRows(data, onChange, { makeNewRow, disableNewRow, addWhenComplete });

  return (
    <StyledWrapper className="env-card-list" data-testid={testId}>
      {rows.map((row, index) => {
        const isBlankRow = index === rows.length - 1 && (!row.name || row.name.trim() === '');
        return (
          <div key={row.id} className={cx('env-card', { disabled: !row.enabled })}>
            {!isBlankRow && (
              <Checkbox
                className="enabled"
                checked={row.enabled}
                ariaLabel={row.name ? `Enable ${row.name}` : 'Enable variable'}
                onChange={(e) => updateRow(index, { enabled: e.target.checked })}
              />
            )}
            <div className="body">
              <div className="name-row">
                <input
                  className="name"
                  data-testid={testId ? `${testId}-name-${index}` : undefined}
                  placeholder="Name"
                  value={row.name}
                  onChange={(e) => updateRow(index, { name: e.target.value })}
                />
                {!isBlankRow && (
                  <button
                    type="button"
                    className="delete"
                    aria-label="Delete variable"
                    title="Delete"
                    onClick={() => removeRow(index)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
              <div className="value">
                {row.secret ? (
                  <SecretValue 
                    value={row.value} 
                    placeholder="Value" 
                    editByDefault={secretEditByDefault} 
                    multiline={editableDataType} 
                    onChange={(v) => updateRow(index, { value: v })} 
                    className="value-secret" 
                  />
                ) : (
                  <textarea
                    className="value-input"
                    data-testid={testId ? `${testId}-value-${index}` : undefined}
                    placeholder="Value"
                    rows={1}
                    value={row.value}
                    onChange={(e) => updateRow(index, { value: e.target.value })}
                  />
                )}
                {editableDataType && !isBlankRow && row.value && (
                  <VariableTypeControl
                    dataType={toDataType(row.dataType)}
                    value={row.value}
                    index={index}
                    onChange={(type) => updateRow(index, { dataType: type })}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </StyledWrapper>
  );
};

export default EnvVarCards;
