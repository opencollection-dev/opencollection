import React from 'react';
import { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { SecretValue } from '../../../../../../ui/SecretValue/SecretValue';
import { TrashIcon } from '../../../../../../assets/icons';
import { useEditableRows } from '../../../../../../hooks/useEditableRows';
import { cx } from '../../../../../../utils/cx';
import { toDataType } from '../../../../../../utils/variableDataType';
import { VariableTypeControl } from '../../Common/VariableTypeControl/VariableTypeControl';
import { StyledWrapper } from './StyledWrapper';

interface EnvVarCardsProps {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  makeNewRow?: () => Partial<KeyValueRow>;
  disableNewRow?: boolean;
  editableDataType?: boolean;
  addWhenComplete?: boolean;
  testId?: string;
}

const EnvVarCards: React.FC<EnvVarCardsProps> = ({
  rows: data,
  onChange,
  makeNewRow,
  disableNewRow = false,
  editableDataType = false,
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
              <input
                type="checkbox"
                className="enabled"
                checked={row.enabled}
                aria-label={row.name ? `Enable ${row.name}` : 'Enable variable'}
                onChange={(e) => updateRow(index, { enabled: e.target.checked })}
              />
            )}
            <div className="body">
              <input
                className="name"
                data-testid={testId ? `${testId}-name-${index}` : undefined}
                placeholder="Name"
                value={row.name}
                onChange={(e) => updateRow(index, { name: e.target.value })}
              />
              <div className="value">
                {row.secret ? (
                  <SecretValue value={row.value} placeholder="Value" onChange={(v) => updateRow(index, { value: v })} className="value-secret" />
                ) : (
                  <input
                    className="value-input"
                    data-testid={testId ? `${testId}-value-${index}` : undefined}
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateRow(index, { value: e.target.value })}
                  />
                )}
                {editableDataType && !row.secret && !isBlankRow ? (
                  <VariableTypeControl
                    dataType={toDataType(row.dataType)}
                    value={row.value}
                    index={index}
                    onChange={(type) => updateRow(index, { dataType: type })}
                  />
                ) : null}
              </div>
            </div>
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
        );
      })}
    </StyledWrapper>
  );
};

export default EnvVarCards;
