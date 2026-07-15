import React, { useState, useEffect } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';
import { getHttpMethod, getRequestUrl, getHttpParams } from '../../../../../../utils/schemaHelpers';
import { syncPathParams, syncQueryParams } from '../../../../../../utils/pathParams';
import { methodColorVars } from '../../../../../../theme/methodColors';
import { MethodBadge } from '../../../../../MethodBadge/MethodBadge';
import { CopyButton } from '../../../../../../ui/CopyButton/CopyButton';

interface QueryBarProps {
  item: HttpRequest;
  onSendRequest: () => void;
  isLoading: boolean;
  onItemChange: (item: HttpRequest) => void;
}

const QueryBar: React.FC<QueryBarProps> = ({ item, onSendRequest, isLoading, onItemChange }) => {
  const [url, setUrl] = useState(getRequestUrl(item));
  const [method, setMethod] = useState(getHttpMethod(item));

  useEffect(() => {
    setUrl(getRequestUrl(item));
    setMethod(getHttpMethod(item));
  }, [item]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    const currentParams = getHttpParams(item);
    const syncedParams = syncQueryParams(syncPathParams(currentParams, newUrl), newUrl);

    const updatedItem = {
      ...item,
      http: {
        ...item.http,
        url: newUrl,
        ...(syncedParams !== currentParams ? { params: syncedParams } : {})
      }
    };
    onItemChange(updatedItem);
  };

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
    const updatedItem = {
      ...item,
      http: {
        ...item.http,
        method: newMethod
      }
    };
    onItemChange(updatedItem);
  };

  return (
    <StyledWrapper className="flex items-center">
      <div className="method-select-wrapper">
        <span aria-hidden="true">
          <MethodBadge method={method} />
        </span>
        <select
          className="method-select"
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          aria-label="HTTP method"
          data-testid="query-bar-method"
        >
          {Object.keys(methodColorVars).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Enter request URL"
        data-testid="query-bar-url"
        className="flex-1 min-w-0 px-3 text-xs font-normal"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 400
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && url.trim() && !isLoading) {
            onSendRequest();
          }
        }}
      />

      <div className="actions">
        <CopyButton text={url} label="Copy URL" copiedLabel="Copied" testId="query-bar-copy-url" />
        <button
          type="button"
          onClick={onSendRequest}
          disabled={isLoading || !url.trim()}
          className="send font-semibold text-white disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          data-testid="query-bar-send"
        >
          {isLoading && (
            <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? 'Sending' : 'Send'}
        </button>
      </div>
    </StyledWrapper>
  );
};

export default QueryBar;
