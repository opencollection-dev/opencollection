import React, { useState, useEffect } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import { getHttpMethod, getRequestUrl, getHttpParams } from '../../../../../../utils/schemaHelpers';
import { syncPathParams, syncQueryParams } from '../../../../../../utils/pathParams';
import { availableMethods, getMethodColorVar } from '../../../../../../theme/methodColors';

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
    <StyledWrapper
      className="flex items-stretch"
      style={{
        height: '36px'
      }}
    >
      <div className="method-select-wrapper">
        <MenuDropdown
          selectedItemId={method}
          placement="bottom-start"
          data-testid="query-bar-method-select"
          items={availableMethods.map((m) => ({
            id: m,
            label: <span style={{ color: getMethodColorVar(m) }}>{m}</span>,
            ariaLabel: m,
            onClick: () => handleMethodChange(m)
          }))}
        >
          <button
            type="button"
            className="method-select h-full"
            aria-label="HTTP method"
            style={{ color: getMethodColorVar(method) }}
          >
            {method}
          </button>
        </MenuDropdown>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Enter request URL"
        className="flex-1 px-3 text-xs font-normal"
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

      <button
        onClick={onSendRequest}
        disabled={isLoading || !url.trim()}
        className="send px-4 uppercase text-xs font-semibold text-white disabled:cursor-not-allowed flex items-center gap-2 transition-all"
      >
        {isLoading && (
          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Sending' : 'Send'}
      </button>
    </StyledWrapper>
  );
};

export default QueryBar;
