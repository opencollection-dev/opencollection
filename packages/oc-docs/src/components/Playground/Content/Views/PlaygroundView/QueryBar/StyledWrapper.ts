import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--oc-radius);
  overflow: hidden;
  transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--bg-primary);

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--oc-brand) 10%, transparent),
                0 1px 2px color-mix(in srgb, var(--oc-text) 5%, transparent);
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
      background-color: color-mix(in srgb, var(--oc-text) 1%, transparent);
    }
  }

  .method-select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .method-select {
    appearance: none;
    display: inline-flex;
    align-items: center;
    margin: 0;
    font-family: inherit;
    line-height: 1;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
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
      background: color-mix(in srgb, var(--oc-text) 8%, transparent);
    }

    &:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--oc-brand) 85%, black);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;