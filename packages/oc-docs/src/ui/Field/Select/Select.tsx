import React from 'react';
import { CaretIcon } from '../../../assets/icons';
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

export const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  id,
  ariaLabel,
  testId
}) => {
  const selected = options.find((option) => option.value === value);

  return (
    <StyledWrapper className="oc-select">
      <span className="oc-select-label" aria-hidden="true">
        {selected ? selected.label : ''}
      </span>
      <span className="oc-select-caret" aria-hidden="true">
        <CaretIcon />
      </span>
      <select
        id={id}
        className="oc-select-native"
        value={value}
        aria-label={ariaLabel}
        data-testid={testId}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </StyledWrapper>
  );
};

export default Select;
