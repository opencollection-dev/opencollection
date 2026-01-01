import React, { useState, useEffect } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';
import { getHttpMethod, getRequestUrl } from '../../../../../../utils/schemaHelpers';

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
    const updatedItem = {
      ...item,
      http: {
        ...item.http,
        url: newUrl
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

  const HTTP_METHODS: Record<string, string> = {
    'GET': '#059669',
    'POST': '#d97706',
    'PUT': '#2563eb',
    'PATCH': '#7c3aed',
    'DELETE': '#dc2626',
    'HEAD': '#64748b',
    'OPTIONS': '#64748b'
  };

  const getMethodColor = (method: string) => HTTP_METHODS[method] || '#64748b';

  return (
    <StyledWrapper 
      className="flex items-stretch"
      style={{ 
        height: '36px'
      }}
    >
      <div className="method-select-wrapper">
        <select
          className="method-select h-full"
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          style={{ color: getMethodColor(method) }}
        >
          {Object.keys(HTTP_METHODS).map((m) => (
            <option key={m} value={m} style={{ color: getMethodColor(m) }}>
              {m}
            </option>
          ))}
        </select>
        <svg
          className="method-select-icon"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
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