import React from 'react';
import { CaretIcon } from '../../../assets/icons';
import MenuDropdown from '../../MenuDropdown';
import { StyledWrapper } from './StyledWrapper';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  id?: string;
  ariaLabel?: string;
  testId?: string;
}

export const Select: React.FC<SelectProps> = ({ value, options, onChange, id, ariaLabel, testId }) => {
  const selected = options.find((option) => option.value === value);

  const items = options.map((option) => ({
    id: option.value,
    label: option.label,
    onClick: () => onChange(option.value)
  }));

  return (
    <MenuDropdown items={items} selectedItemId={value} placement="bottom-start" data-testid={testId}>
      <StyledWrapper className="oc-select" id={id} role="button" tabIndex={0} aria-label={ariaLabel}>
        <span className="oc-select-label" aria-hidden="true">
          {selected ? selected.label : ''}
        </span>
        <span className="oc-select-caret" aria-hidden="true">
          <CaretIcon />
        </span>
      </StyledWrapper>
    </MenuDropdown>
  );
};

export default Select;
