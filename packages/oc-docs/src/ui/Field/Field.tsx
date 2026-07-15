import React from 'react';
import { Input } from './Input/Input';
import { Select } from './Select/Select';
import { StyledWrapper } from './StyledWrapper';

interface FieldProps {
  label?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

type FieldComponent = React.FC<FieldProps> & {
  Input: typeof Input;
  Select: typeof Select;
};

const Field = (({ label, htmlFor, children }: FieldProps) => (
  <StyledWrapper className="oc-field">
    {label && (
      <label className="oc-label" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
  </StyledWrapper>
)) as FieldComponent;

Field.Input = Input;
Field.Select = Select;

export { Field };
export default Field;
