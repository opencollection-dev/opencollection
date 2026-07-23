import React, { useCallback, useRef, useState, type ReactNode } from 'react';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import type { MenuDropdownHandle } from '../MenuDropdown/types';
import { ChevronsRightIcon, DotIcon } from '../../assets/icons';
import { useResponsiveTabs } from './useResponsiveTabs';
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
  variant?: 'underline' | 'button' | 'responsive';
  className?: string;
  testId?: string;
  ariaLabel?: string;
  keepMounted?: boolean;
}

const renderIndicator = (tab: Tab): ReactNode => {
  const indicator = tab.count ?? tab.contentIndicator;
  if (indicator === undefined) return null;
  if (typeof indicator === 'number') return <sup className="tab-count">{indicator}</sup>;
  return (
    <sup className="tab-status-dot" aria-hidden="true">
      <DotIcon />
    </sup>
  );
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  rightElement,
  variant = 'underline',
  className,
  testId = 'tabs',
  ariaLabel,
  keepMounted = false
}) => {
  const [internalActive, setInternalActive] = useState(defaultActiveTab ?? tabs[0]?.id ?? '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const moreRef = useRef<MenuDropdownHandle>(null);

  const requested = activeTab ?? internalActive;
  const current = tabs.some((tab) => tab.id === requested) ? requested : (tabs[0]?.id ?? '');

  const isResponsive = variant === 'responsive';
  const { containerRef, rightRef, setMeasureRef, visibleIds, overflowIds } = useResponsiveTabs(
    tabs.map((tab) => tab.id),
    current,
    isResponsive
  );

  const visibleTabs = isResponsive ? tabs.filter((tab) => visibleIds.includes(tab.id)) : tabs;
  const overflowTabs = isResponsive ? tabs.filter((tab) => overflowIds.includes(tab.id)) : [];
  const navTabs = visibleTabs;

  const activate = useCallback(
    (id: string) => {
      if (activeTab === undefined) setInternalActive(id);
      onTabChange?.(id);
    },
    [activeTab, onTabChange]
  );

  const focusSibling = useCallback(
    (fromIndex: number, step: number) => {
      const total = navTabs.length;
      for (let i = 1; i <= total; i += 1) {
        const tab = navTabs[(fromIndex + step * i + total) % total];
        if (tab && !tab.disabled) {
          activate(tab.id);
          tabRefs.current[tab.id]?.focus();
          return;
        }
      }
    },
    [navTabs, activate]
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

  const renderTabButton = (tab: Tab, navIndex: number) => {
    const isActive = tab.id === current;
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
        className={['tab', isActive ? 'is-active' : '', tab.disabled ? 'disabled' : ''].filter(Boolean).join(' ')}
        onClick={() => activate(tab.id)}
        onKeyDown={(event) => onKeyDown(event, navIndex)}
        data-testid={tabButtonId(tab.id)}
      >
        {tab.label}
        {renderIndicator(tab)}
      </button>
    );
  };

  const overflowItems = overflowTabs.map((tab) => ({
    id: tab.id,
    label: (
      <span className="tabs-more-item">
        {tab.label}
        {renderIndicator(tab)}
      </span>
    ),
    ariaLabel: tab.label,
    onClick: () => {
      activate(tab.id);
      moreRef.current?.hide();
    }
  }));

  return (
    <StyledWrapper
      className={['oc-tabs', className, `tabs-variant-${variant}`].filter(Boolean).join(' ')}
      data-testid={testId}
      ref={isResponsive ? containerRef : undefined}
    >
      <div className="tabs-header">
        <div className="tabs" role="tablist" aria-label={ariaLabel}>
          {isResponsive && (
            <div className="tabs-measure" aria-hidden="true" data-testid={`${testId}-measure`}>
              {tabs.map((tab) => (
                <span
                  key={tab.id}
                  ref={setMeasureRef(tab.id)}
                  className={['tab', tab.id === current ? 'is-active' : ''].filter(Boolean).join(' ')}
                >
                  {tab.label}
                  {renderIndicator(tab)}
                </span>
              ))}
            </div>
          )}
          {visibleTabs.map((tab, index) => renderTabButton(tab, index))}
          {overflowTabs.length > 0 && (
            <MenuDropdown
              ref={moreRef}
              items={overflowItems}
              placement="bottom-start"
              selectedItemId={current}
              testId={`${testId}-more`}
            >
              <button type="button" className="tabs-more" aria-label="More tabs">
                <ChevronsRightIcon />
              </button>
            </MenuDropdown>
          )}
        </div>
        {rightContent !== undefined && (
          <div className="tabs-right" ref={isResponsive ? rightRef : undefined}>
            {rightContent}
          </div>
        )}
      </div>
      {keepMounted
        ? tabs.map((tab) => (
            <div
              key={tab.id}
              id={panelId(tab.id)}
              role="tabpanel"
              aria-labelledby={tabButtonId(tab.id)}
              className="tab-panel"
              tabIndex={0}
              aria-hidden={tab.id !== current}
              style={{ display: tab.id === current ? undefined : 'none' }}
            >
              {tab.content}
            </div>
          ))
        : activeTabData && (
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
