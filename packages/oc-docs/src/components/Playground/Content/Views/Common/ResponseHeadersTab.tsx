import React from 'react';

interface ResponseHeadersTabProps {
  headers?: Record<string, any>;
}

const ResponseHeadersTab: React.FC<ResponseHeadersTabProps> = ({ headers }) => {
  return (
    <div className="h-full overflow-auto">
      <div className="py-3">
        {headers ? (
          <div className="space-y-0">
            {Object.entries(headers).map(([key, value], index) => (
              <div 
                key={key} 
                className="flex items-center gap-4 py-1.5 border-b"
                style={{ 
                  borderColor: 'var(--border-color)',
                  borderBottomWidth: index === Object.entries(headers).length - 1 ? '0' : '1px'
                }}
              >
                <span 
                  className="font-mono text-xs font-medium" 
                  style={{ 
                    color: 'var(--text-primary)', 
                    minWidth: '180px',
                    letterSpacing: '0.01em'
                  }}
                >
                  {key}
                </span>
                <span 
                  className="font-mono text-xs flex-1 break-all" 
                  style={{ 
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-xs">No response headers</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseHeadersTab;

