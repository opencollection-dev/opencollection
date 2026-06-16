import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { PageProps } from '../../routing/types';
import { getRequestUrl } from '../../utils/schemaHelpers';
import { getMethodColorVar } from '../../theme/methodColors';
import PlaceholderBody from './PlaceholderBody';

/**
 * Request page (BRU-3188 scaffold). Rich body (headers/auth/params/body/
 * code-snippet sections) owned by BRU-3569's shared section library.
 */
const RequestPage: React.FC<PageProps> = ({ node, onOpenPlayground }) => {
  const url = node.item ? getRequestUrl(node.item as HttpRequest) : '';
  return (
    <PlaceholderBody title={node.name} ownedBy="BRU-3569 (request sections)">
      <div className="flex items-center gap-3 flex-wrap">
        {node.method && (
          <span style={{ color: getMethodColorVar(node.method), fontWeight: 700, fontSize: '0.85rem' }}>
            {node.method.toUpperCase()}
          </span>
        )}
        {url && (
          <code style={{ color: 'var(--oc-text-secondary, var(--text-secondary))', fontSize: '0.85rem' }}>
            {url}
          </code>
        )}
        {onOpenPlayground && (
          <button
            type="button"
            onClick={onOpenPlayground}
            data-testid="try-button"
            style={{
              fontSize: '0.8rem',
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid var(--oc-border-border1, var(--border-color))',
              color: 'var(--oc-text-primary, var(--text-primary))',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Try
          </button>
        )}
      </div>
    </PlaceholderBody>
  );
};

export default RequestPage;
