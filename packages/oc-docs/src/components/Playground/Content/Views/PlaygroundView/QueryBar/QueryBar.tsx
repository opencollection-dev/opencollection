import React, { useState, useEffect, useRef } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import { getHttpMethod, getRequestUrl, getHttpParams } from '../../../../../../utils/schemaHelpers';
import { syncPathParams, syncQueryParams } from '../../../../../../utils/pathParams';
import { methodColorVars, getMethodColorVar } from '../../../../../../theme/methodColors';

interface QueryBarProps {
  item: HttpRequest;
  onSendRequest: () => void;
  isLoading: boolean;
  onItemChange: (item: HttpRequest) => void;
}

const QueryBar: React.FC<QueryBarProps> = ({ item, onSendRequest, isLoading, onItemChange }) => {
  const [url, setUrl] = useState(getRequestUrl(item));
  const [method, setMethod] = useState(getHttpMethod(item));
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(getRequestUrl(item));
    setMethod(getHttpMethod(item));
    setIsCustomMode(false);
    setCustomValue('');
  }, [item]);

  useEffect(() => {
    if (isCustomMode) {
      customInputRef.current?.focus();
      customInputRef.current?.select();
    }
  }, [isCustomMode]);

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

  const getMethodColor = getMethodColorVar;

  const standardMethods = Object.keys(methodColorVars);
  const isStandardMethod = standardMethods.includes(method.toUpperCase());

  const enterCustomMode = () => {
    setCustomValue('');
    setIsCustomMode(true);
  };

  const commitCustomMethod = () => {
    const trimmed = customValue.trim().toUpperCase();
    if (trimmed) {
      handleMethodChange(trimmed);
    }
    setIsCustomMode(false);
  };

  const cancelCustomMode = () => {
    setIsCustomMode(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitCustomMethod();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCustomMode();
    }
  };

  return (
    <StyledWrapper 
      className="flex items-stretch"
      style={{ 
        height: '36px'
      }}
    >
      <div className="method-select-wrapper">
        {isCustomMode ? (
          <input
            ref={customInputRef}
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value.toUpperCase())}
            onKeyDown={handleCustomKeyDown}
            onBlur={commitCustomMethod}
            className="method-custom-input h-full"
            style={{
              color: getMethodColor(customValue),
              width: `calc(${Math.min(Math.max(customValue.length + 1, 4), 16)}ch + 1rem)`
            }}
            aria-label="Custom HTTP method"
            data-testid="method-custom-input"
          />
        ) : (
          <MenuDropdown
            selectedItemId={isStandardMethod ? method.toUpperCase() : null}
            placement="bottom-start"
            data-testid="method-select"
            items={standardMethods.map((m) => ({
              id: m,
              label: <span style={{ color: getMethodColor(m) }}>{m}</span>,
              ariaLabel: m,
              onClick: () => handleMethodChange(m)
            }))}
            footer={
              <button
                type="button"
                className="method-add-custom"
                onClick={enterCustomMode}
                data-testid="method-select-add-custom"
              >
                + Add custom
              </button>
            }
          >
            <button
              type="button"
              className="method-select h-full"
              aria-label="HTTP method"
              title={method}
              style={{ color: getMethodColor(method) }}
            >
              <span className="method-select-label">{method}</span>
            </button>
          </MenuDropdown>
        )}
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