import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  margin-top: 0.3125rem;
  padding: 0 1rem 1rem;
  text-align: center;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1;
  color: var(--text-muted);

  .powered-by-link {
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .powered-by-link:hover {
    color: var(--text-primary);
  }
`;
