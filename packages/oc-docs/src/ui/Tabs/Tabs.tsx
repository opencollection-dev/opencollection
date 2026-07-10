import React, { useState, ReactNode } from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface Tab {
  id: string;
  label: string;
  contentIndicator?: string | number;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  rightElement?: ReactNode;
  variant?: 'underline' | 'button';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className = '',
  rightElement,
  variant = 'underline'
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : '')
  );

  // Use controlled active tab if provided, otherwise use internal state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <StyledWrapper className={`${className} tabs-variant-${variant}`.trim()}>
      <div className="tabs-header">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              type="button"
            >
              {tab.label}
              {tab.contentIndicator !== undefined && (
                <sup className="content-indicator">{tab.contentIndicator}</sup>
              )}
            </button>
          ))}
        </div>
        {rightElement && (
          <div className="tabs-right">
            {rightElement}
          </div>
        )}
      </div>
      {activeTabData && (
        <div className="tab-content">
          {activeTabData.content}
        </div>
      )}
    </StyledWrapper>
  );
};

export default Tabs;