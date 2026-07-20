import React from 'react';
import { Tooltip } from '../../../../../../ui/Tooltip/Tooltip';
import { CaretIcon, WarningIcon } from '../../../../../../assets/icons';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import {
  VARIABLE_DATA_TYPES,
  parseValueByDataType,
  validateDataTypeValue,
  type VariableDataType
} from '../../../../../../utils/variableDataType';
import { StyledWrapper } from './StyledWrapper';

interface VariableTypeControlProps {
  dataType: VariableDataType;
  value: string;
  index: number;
  onChange: (dataType: VariableDataType) => void;
}

/**
 * Editable data-type dropdown for a variable row: pick the type and, when the value can't be
 * coerced to it, surface an advisory warning. Shared by the collection/folder/request variable
 * tables and the environment variables view so the type UI stays identical everywhere.
 */
export const VariableTypeControl: React.FC<VariableTypeControlProps> = ({ dataType, value, index, onChange }) => {
  const warning = validateDataTypeValue(parseValueByDataType(value, dataType), dataType);
  return (
    <StyledWrapper className="var-type">
      {warning && (
        <Tooltip content={warning}>
          <span className="var-type-warning" role="img" aria-label={warning}>
            <WarningIcon />
          </span>
        </Tooltip>
      )}
      <MenuDropdown
        selectedItemId={dataType}
        placement="bottom-end"
        testId={`variable-data-type-${index}`}
        items={VARIABLE_DATA_TYPES.map((type) => ({
          id: type,
          label: type,
          onClick: () => onChange(type)
        }))}
      >
        <button type="button" className="var-type-control" aria-label="Variable data type">
          <span className="var-type-label" aria-hidden="true">
            {dataType}
          </span>
          <span className="var-type-caret" aria-hidden="true">
            <CaretIcon />
          </span>
        </button>
      </MenuDropdown>
    </StyledWrapper>
  );
};

export default VariableTypeControl;
