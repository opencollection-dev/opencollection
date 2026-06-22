import styled from '@emotion/styled';

/** Inline text wrapper; only the `{{var}}` tokens are rendered as subtle accent chips. */
export const VariableTextWrapper = styled.span`
  .oc-var {
    /* Design: brand-text on a subtle brand tint, 3px radius, 3px horizontal padding.
       Inherits the surrounding font (mono in URL bar / value cells) so the token
       reads inline with the value it sits in. */
    color: var(--primary-text);
    background-color: var(--brand-soft);
    border-radius: 0.1875rem;
    padding: 0 0.1875rem;
  }
`;
