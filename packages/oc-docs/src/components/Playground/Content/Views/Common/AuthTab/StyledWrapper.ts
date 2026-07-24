import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    color: var(--text-primary);
  }

  .description {
    color: var(--text-secondary);
  }

  .auth-header {
    margin-bottom: 0.75rem;
  }

  .auth-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .auth-empty {
    margin: 0;
    font-style: italic;
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .auth-inherited-mode {
    color: var(--primary-text);
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
