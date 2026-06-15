import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MinimalDataTableProps {
  data: any[];
  title?: string;
  columns: Column[];
  compact?: boolean;
}

export const MinimalDataTable: React.FC<MinimalDataTableProps> = ({
  data,
  title,
  columns,
  compact = true
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="minimal-table">
      {title && <h3 className="section-title">{title}</h3>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="table-value">{row[col.key] || '-'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'warning' | 'error';
  text?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const statusConfig = {
    active: {
      bg: 'var(--oc-status-success-background)',
      color: 'var(--oc-status-success-text)',
      border: 'var(--oc-status-success-border)',
      label: 'Active'
    },
    inactive: {
      bg: 'var(--oc-background-surface0)',
      color: 'var(--oc-colors-text-muted)',
      border: 'var(--oc-border-border2)',
      label: 'Inactive'
    },
    warning: {
      bg: 'var(--oc-status-warning-background)',
      color: 'var(--oc-status-warning-text)',
      border: 'var(--oc-status-warning-border)',
      label: 'Warning'
    },
    error: {
      bg: 'var(--oc-status-danger-background)',
      color: 'var(--oc-status-danger-text)',
      border: 'var(--oc-status-danger-border)',
      label: 'Error'
    }
  };

  const config = statusConfig[status];

  return (
    <span 
      className="status-badge" 
      style={{ 
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      {text || config.label}
    </span>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  tooltip,
  size = 'medium'
}) => {
  return (
    <button
      className={`icon-button icon-button-${size}`}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
};

interface TabGroupProps {
  tabs: Array<{ id: string; label: string }>;
  defaultTab?: string;
  renderContent: (activeTab: string) => React.ReactNode;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  defaultTab,
  renderContent
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className="tab-group">
      <div className="tab-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderContent(activeTab)}
      </div>
    </div>
  );
};