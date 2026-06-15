import styled from '@emotion/styled';

const StyledWrapper = styled.div`
  margin-top: 1rem;

  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .examples-container {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--oc-background-base);
  }

  .example-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--oc-background-mantle);
    border-bottom: 1px solid var(--border-color);
  }

  .example-tabs-left {
    display: flex;
    gap: 0;
    overflow-x: auto;
  }

  .example-tabs-right {
    padding-right: 0.75rem;
  }

  .example-url-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--oc-background-base);
    border-bottom: 1px solid var(--border-color);
    font-family: var(--font-mono, 'SF Mono', 'Consolas', monospace);
    font-size: 0.75rem;
  }

  .example-url-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .example-method {
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--oc-colors-text-white);
  }

  .example-method.get { background-color: var(--oc-request-methods-get); }
  .example-method.post { background-color: var(--oc-request-methods-post); }
  .example-method.put { background-color: var(--oc-request-methods-put); }
  .example-method.patch { background-color: var(--oc-request-methods-patch); }
  .example-method.delete { background-color: var(--oc-request-methods-delete); }

  .example-url {
    color: var(--text-primary);
    word-break: break-all;
  }

  .example-tab {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .example-tab:hover {
    color: var(--text-primary);
    background-color: var(--oc-background-base);
  }

  .example-tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    background-color: var(--oc-background-base);
  }

  .example-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    .example-content {
      grid-template-columns: 1fr;
    }
  }

  .content-section {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color);
    min-height: 150px;
  }

  .content-section:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    .content-section {
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }

    .content-section:last-child {
      border-bottom: none;
    }
  }

  .section-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color);
    min-height: 40px;
  }

  .content-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .status-badge.success {
    background-color: var(--oc-status-success-background);
    color: var(--oc-status-success-text);
  }

  .status-badge.redirect {
    background-color: var(--oc-status-warning-background);
    color: var(--oc-status-warning-text);
  }

  .status-badge.client-error {
    background-color: var(--oc-status-danger-background);
    color: var(--oc-status-danger-text);
  }

  .status-badge.server-error {
    background-color: var(--oc-status-danger-background);
    color: var(--oc-status-danger-text);
  }

  .content-toggle {
    display: flex;
    align-items: center;
    background-color: var(--oc-background-base);
    border-radius: 0.25rem;
    padding: 0.125rem;
    border: 1px solid var(--border-color);
  }

  .toggle-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 0.125rem;
    transition: all 0.15s ease;
  }

  .toggle-btn:hover {
    color: var(--text-primary);
  }

  .toggle-btn.active {
    color: var(--text-primary);
    background-color: var(--oc-background-surface0);
  }

  .toggle-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .copy-curl-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--oc-background-base);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .copy-curl-btn:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .copy-curl-btn.copied {
    color: var(--oc-colors-text-green);
    border-color: var(--oc-colors-text-green);
  }

  .copy-curl-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .copy-dropdown {
    position: relative;
  }

  .copy-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.25rem;
    background: var(--oc-background-base);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    box-shadow: var(--oc-shadow-md);
    z-index: 10;
    min-width: 120px;
    overflow: hidden;
  }

  .copy-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.15s ease;
  }

  .copy-menu-item:hover {
    background-color: var(--oc-background-mantle);
  }

  .copy-menu-item.copied {
    color: var(--oc-colors-text-green);
  }

  .body-content {
    padding: 0.75rem 1rem;
    overflow-x: auto;
    background-color: var(--code-bg);
    flex: 1;
    position: relative;
  }

  .body-copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--oc-background-base);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.15s ease;
    opacity: 0;
  }

  .body-content:hover .body-copy-btn {
    opacity: 1;
  }

  .body-copy-btn:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .body-copy-btn.copied {
    color: var(--oc-colors-text-green);
    border-color: var(--oc-colors-text-green);
    opacity: 1;
  }

  .body-content pre {
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
    font-family: var(--font-mono, 'SF Mono', 'Consolas', monospace);
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--code-text);
  }

  .headers-table {
    width: 100%;
    font-size: 0.75rem;
    border-collapse: collapse;
  }

  .headers-table th {
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--oc-background-mantle);
    border-bottom: 1px solid var(--border-color);
  }

  .headers-table td {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    font-family: var(--font-mono, monospace);
  }

  .headers-table tr:last-child td {
    border-bottom: none;
  }

  .no-content {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.75rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default StyledWrapper;
