import styled from '@emotion/styled';

/**
 * XML tree styling. Ported from bruno-app's XmlPreview styled-components
 * wrapper, with theme tokens mapped onto oc-docs `--oc-*` CSS variables.
 */
export const StyledWrapper = styled.div`
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 20px;
  padding: 16px;
  overflow: auto;
  color: var(--oc-text);

  .xml-container {
    color: var(--oc-text);
  }

  .xml-node-name {
    color: var(--oc-codemirror-tokens-property);
    font-weight: 500;
  }

  .xml-separator {
    color: var(--oc-codemirror-tokens-operator);
    margin: 0 8px;
  }

  .xml-value {
    color: var(--oc-codemirror-tokens-string);
    white-space: pre-wrap;
    word-break: break-all;
  }

  .xml-empty-value {
    color: var(--oc-codemirror-tokens-comment);
  }

  .xml-count {
    color: var(--oc-codemirror-tokens-comment);
    margin-left: 8px;
  }

  .xml-toggle-button,
  .xml-array-toggle-button {
    margin-right: 8px;
    cursor: pointer;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--oc-codemirror-tokens-atom);
    flex-shrink: 0;
    border-radius: 4px;
    background: transparent;
    border: 0;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--oc-console-button-hover-bg);
    }
  }
`;

export default StyledWrapper;
