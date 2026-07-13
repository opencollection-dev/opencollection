import React from 'react';
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
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  id,
  ariaLabel,
  testId,
  className,
  disabled = false
}) => {
  const selected = options.find((option) => option.value === value);

  return (
    <StyledWrapper className={['oc-select', disabled && 'oc-select--disabled', className].filter(Boolean).join(' ')}>
      <span className="oc-select-label" aria-hidden="true">
        {selected ? selected.label : ''}
      </span>
      <span className="oc-select-caret" aria-hidden="true">
        <svg viewBox="0 0 10 10" width="100%" height="100%" fill="none" focusable="false">
          <path d="M2.5 4 5 6.5 7.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <select
        id={id}
        className="oc-select-native"
        value={value}
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
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
