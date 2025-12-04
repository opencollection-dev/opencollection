import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--bg-primary);

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1), 
                0 1px 2px rgba(0, 0, 0, 0.05);
  }

  input {
    outline: none;
    background-color: transparent;
    color: var(--text-primary);
    border-radius: 0;
    border: none;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }
    
    &:focus::placeholder {
      opacity: 0.45;
    }
    
    &:focus {
      background-color: rgba(0, 0, 0, 0.01);
    }
  }

  button.send {
    background-color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(0, 0, 0, 0.08);
    }
    
    &:hover:not(:disabled) {
      background-color: #c2690a;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;