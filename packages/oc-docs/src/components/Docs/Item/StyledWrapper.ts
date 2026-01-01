import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  width: 100%;
  max-width: 80rem;
  margin-right: 0;

  .item-header-minimal {
    margin-bottom: 0.75rem;
  }

  .item-title-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .item-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .item-type-badge.folder {
    background-color: #e0e7ff;
    color: #3730a3;
  }

  .item-type-badge.script {
    background-color: #dcfce7;
    color: #047857;
  }

  .item-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .item-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .item-docs {
    max-width: none;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .item-docs h1 {
    margin: 0 0 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .item-docs h2 {
    margin: 1rem 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .item-docs h3 {
    margin: 0.75rem 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .item-docs p {
    margin: 0 0 0.75rem;
  }

  .item-docs a {
    color: var(--primary-color);
    text-decoration: underline;
    transition: opacity 0.2s ease;
  }

  .item-docs a:hover {
    opacity: 0.8;
  }

  .item-docs code {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: var(--font-mono);
    background-color: var(--code-bg);
    color: var(--code-text);
  }

  .item-docs pre {
    margin: 0 0 0.75rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    overflow-x: auto;
    background-color: var(--code-bg);
    color: var(--code-text);
  }

  .item-docs ul,
  .item-docs ol {
    margin: 0 0 0.75rem;
    padding-left: 1rem;
  }

  .item-docs ul {
    list-style: disc inside;
  }

  .item-docs ol {
    list-style: decimal inside;
  }

  .item-docs li {
    margin: 0.25rem 0;
  }

  .item-docs blockquote {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 4px solid var(--border-color);
    font-style: italic;
    color: var(--text-secondary);
  }

  .item-content-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-content-main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .request-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .request-body-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .endpoint-badges {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .badge-method {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: white;
  }

  .badge-url {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    background-color: var(--badge-bg);
    color: #313131;
  }

  .badge-try {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #1d4ed8;
    background-color: #dbeafe;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .badge-try:hover {
    background-color: #bfdbfe;
  }

  @media (min-width: 1024px) {
    .item-content-main {
      flex-direction: row;
    }

    .request-details {
      flex: 4;
      min-width: 0;
    }

    .code-snippets-wrapper {
      flex: 3;
      min-width: 0;
    }
  }
`;

