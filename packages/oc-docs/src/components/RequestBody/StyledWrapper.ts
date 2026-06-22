import styled from '@emotion/styled';

export const RequestBodyWrapper = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
  .oc-request-body-file {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--text-primary);
    word-break: break-all;
  }
`;
