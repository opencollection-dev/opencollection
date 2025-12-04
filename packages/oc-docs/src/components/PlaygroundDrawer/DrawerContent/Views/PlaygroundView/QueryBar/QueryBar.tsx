import React, { useState, useEffect } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { StyledWrapper } from './StyledWrapper';

interface QueryBarProps {
  item: HttpRequest;
  onSendRequest: () => void;
  isLoading: boolean;
  onItemChange: (item: HttpRequest) => void;
}

const QueryBar: React.FC<QueryBarProps> = ({ item, onSendRequest, isLoading, onItemChange }) => {
  const [url, setUrl] = useState(item.url || '');
  const [method, setMethod] = useState(item.method || 'GET');

  useEffect(() => {
    setUrl(item.url || '');
    setMethod(item.method || 'GET');
  }, [item]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onItemChange({ ...item, url: newUrl });
  };

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      'GET': '#059669',      // muted green
      'POST': '#d97706',     // muted orange
      'PUT': '#2563eb',      // muted blue
      'PATCH': '#7c3aed',    // muted purple
      'DELETE': '#dc2626',   // muted red
      'HEAD': '#64748b',     // muted gray
      'OPTIONS': '#64748b'   // muted gray
    };
    return colors[method] || '#64748b';
  };

  return (
    <StyledWrapper 
      className="flex items-stretch"
      style={{ 
        height: '36px'
      }}
    >
      <div className="relative flex items-center">
        <div
          className="h-full pl-3 text-xs font-semibold flex items-center"
          style={{
            color: getMethodColor(method),
            fontWeight: 600,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {method}
        </div>
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