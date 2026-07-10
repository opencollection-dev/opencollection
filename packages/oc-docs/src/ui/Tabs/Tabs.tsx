import React, { useCallback, useRef, useState, type ReactNode } from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface Tab {
  id: string;
  label: string;
  count?: number;
  contentIndicator?: string | number;
  content: ReactNode;
  rightElement?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onTabChange?: (id: string) => void;
  rightElement?: ReactNode;
  className?: string;
  testId?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  rightElement,
  className,
  testId = 'tabs',
  ariaLabel
}) => {
  const [internalActive, setInternalActive] = useState(defaultActiveTab ?? tabs[0]?.id ?? '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const requested = activeTab ?? internalActive;
  const current = tabs.some((tab) => tab.id === requested) ? requested : (tabs[0]?.id ?? '');

  const activate = useCallback(
    (id: string) => {
      if (activeTab === undefined) setInternalActive(id);
      onTabChange?.(id);
    },
    [activeTab, onTabChange]
  );

  const focusSibling = useCallback(
    (fromIndex: number, step: number) => {
      const total = tabs.length;
      for (let i = 1; i <= total; i += 1) {
        const tab = tabs[(fromIndex + step * i + total) % total];
        if (!tab.disabled) {
          activate(tab.id);
          tabRefs.current[tab.id]?.focus();
          return;
        }
      }
    },
    [tabs, activate]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in step) {
      event.preventDefault();
      focusSibling(index, step[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusSibling(-1, 1);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusSibling(0, -1);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === current);
  const rightContent = activeTabData?.rightElement ?? rightElement;
  const tabButtonId = (id: string) => `${testId}-tab-${id}`;
  const panelId = (id: string) => `${testId}-panel-${id}`;

  return (
    <StyledWrapper className={['oc-tabs', className].filter(Boolean).join(' ')} data-testid={testId}>
      <div className="tabs-header">
        <div className="tabs" role="tablist" aria-label={ariaLabel}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === current;
            const indicator = tab.count ?? tab.contentIndicator;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                id={tabButtonId(tab.id)}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId(tab.id)}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                className={['tab', isActive ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={() => activate(tab.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                data-testid={`${testId}-tab-${tab.id}`}
              >
                {tab.label}
                {indicator !== undefined && <sup className="tab-count">{indicator}</sup>}
              </button>
            );
          })}
        </div>
        {rightContent !== undefined && <div className="tabs-right">{rightContent}</div>}
      </div>
      {activeTabData && (
        <div
          key={activeTabData.id}
          id={panelId(activeTabData.id)}
          role="tabpanel"
          aria-labelledby={tabButtonId(activeTabData.id)}
          className="tab-panel"
          tabIndex={0}
        >
          {activeTabData.content}
        </div>
      )}
    </StyledWrapper>
  );
};

export default Tabs;
