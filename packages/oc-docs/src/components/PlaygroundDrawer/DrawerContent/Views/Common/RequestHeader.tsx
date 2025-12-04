import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
  toggleRunnerMode?: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ 
  item, 
  collection, 
  selectedEnvironment, 
  onEnvironmentChange,
  toggleRunnerMode 
}) => {
  return (
    <div 
      className="flex items-center justify-between pb-5"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '54px'
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <h2 
          className="text-lg font-semibold truncate tracking-tight"
          style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.015em',
            lineHeight: '1.3'
          }}
          title={item.name || 'Untitled Request'}
        >
          {item.name || 'Untitled Request'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {(collection as any).environments && (collection as any).environments.length > 0 && (
          <select
            value={selectedEnvironment}
            onChange={(e) => onEnvironmentChange(e.target.value)}
            className="text-xs font-medium cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              padding: '6px 26px 6px 10px',
              minWidth: '130px',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '26px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.12)';
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseEnter={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            <option value="">No Environment</option>
            {(collection as any).environments.map((env: any) => (
              <option key={env.name} value={env.name}>
                {env.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default RequestHeader;
