import React from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '@slices/theme';

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;
  background: var(--oc-sidebar-bg);
  color: var(--oc-sidebar-color, var(--oc-text));
  border: 1px solid var(--oc-border-border1);
  border-radius: var(--oc-border-radius-md, 4px);
  padding: 5px 10px;
  cursor: pointer;
  font: inherit;
  font-size: 12.5px;
  transition: background-color 0.12s ease, color 0.12s ease;

  &:hover {
    background: var(--oc-sidebar-collection-item-hover-bg, var(--oc-sidebar-bg));
  }
`;

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <Button
      type="button"
      aria-label="Toggle light/dark theme"
      onClick={() => dispatch(toggleTheme())}
    >
      {mode === 'dark' ? '☀︎ Light' : '☾ Dark'}
    </Button>
  );
};

export default ThemeToggle;
