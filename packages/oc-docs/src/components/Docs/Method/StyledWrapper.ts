import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.4rem;
  font-size: 9px;
  font-weight: 700;
  border-radius: 3px;
  text-transform: uppercase;
  font-family: var(--font-sans);
  min-width: 36px;
  margin-right: 8px;
  letter-spacing: 0.05em;

  &.get {
    background-color: color-mix(in srgb, var(--oc-request-methods-get) 10%, transparent);
    color: var(--oc-request-methods-get);
  }

  &.post {
    background-color: color-mix(in srgb, var(--oc-request-methods-post) 10%, transparent);
    color: var(--oc-request-methods-post);
  }

  &.put {
    background-color: color-mix(in srgb, var(--oc-request-methods-put) 10%, transparent);
    color: var(--oc-request-methods-put);
  }

  &.delete {
    background-color: color-mix(in srgb, var(--oc-request-methods-delete) 10%, transparent);
    color: var(--oc-request-methods-delete);
  }

  &.patch {
    background-color: color-mix(in srgb, var(--oc-request-methods-patch) 10%, transparent);
    color: var(--oc-request-methods-patch);
  }

  &.options {
    background-color: color-mix(in srgb, var(--oc-request-methods-options) 10%, transparent);
    color: var(--oc-request-methods-options);
  }

  &.head {
    background-color: color-mix(in srgb, var(--oc-request-methods-head) 10%, transparent);
    color: var(--oc-request-methods-head);
  }
`;
