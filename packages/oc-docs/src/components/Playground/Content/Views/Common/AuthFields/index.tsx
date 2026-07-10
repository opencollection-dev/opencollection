import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export const AuthField: React.FC<{
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  testId?: string;
  onChange: (value: string) => void;
}> = ({ label, value, type = 'text', placeholder, testId, onChange }) => (
  <StyledWrapper className="auth-field">
    <label className="auth-field-label">{label}</label>
    <input
      className="auth-control"
      data-testid={testId}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  </StyledWrapper>
);

export const AuthSelect: React.FC<{
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  testId?: string;
  onChange: (value: string) => void;
}> = ({ label, value, options, testId, onChange }) => (
  <StyledWrapper className="auth-field">
    <label className="auth-field-label">{label}</label>
    <select className="auth-control" data-testid={testId} value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </StyledWrapper>
);

export const AuthCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <StyledWrapper as="label" className="auth-checkbox">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </StyledWrapper>
);
