import React, { useState, useEffect } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import { getHttpMethod, getRequestUrl, getHttpParams } from '../../../../../../utils/schemaHelpers';
import { syncPathParams, syncQueryParams } from '../../../../../../utils/pathParams';
import { availableMethods } from '../../../../../../theme/methodColors';
import { MethodBadge } from '../../../../../MethodBadge/MethodBadge';
import { CopyButton } from '../../../../../../ui/CopyButton/CopyButton';
import { SendIcon } from '../../../../../../assets/icons';

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
    <StyledWrapper>
      <MenuDropdown
        selectedItemId={method}
        placement="bottom-start"
        testId="method-select"
        role="listbox"
        size="sm"
        items={availableMethods.map((m) => ({
          id: m,
          label: <MethodBadge method={m} />,
          ariaLabel: m,
          onClick: () => handleMethodChange(m)
        }))}
      >
        <button type="button" className="method-select" aria-label="HTTP method">
          <MethodBadge method={method} short />
        </button>
      </MenuDropdown>

      <input
        type="text"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Enter request URL"
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
          className="send"
        >
          {isLoading ? (
            <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <SendIcon />
          )}
          {isLoading ? 'Sending' : 'Send'}
        </button>
      </div>
    </StyledWrapper>
  );
};

export default QueryBar;
