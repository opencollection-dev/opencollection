import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import { getItemName } from '../../../../../utils/schemaHelpers';
import MenuDropdown from '../../../../../ui/MenuDropdown';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
  toggleRunnerMode?: () => void;
  readOnlyEnvironment?: boolean;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({
  item,
  collection,
  selectedEnvironment,
  onEnvironmentChange,
  toggleRunnerMode,
  readOnlyEnvironment
}) => {
  const itemName = getItemName(item) || 'Untitled Request';

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
          title={itemName}
        >
          {itemName}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {(collection as any).environments && (collection as any).environments.length > 0 && (
          <MenuDropdown
            selectedItemId={selectedEnvironment}
            placement="bottom-end"
            items={[
              { id: '', label: 'No Environment', onClick: () => onEnvironmentChange('') },
              ...(collection as any).environments.map((env: any) => ({
                id: env.name,
                label: env.name,
                onClick: () => onEnvironmentChange(env.name)
              }))
            ]}
          >
            {/* Trigger preserves the previous native-select styling verbatim;
                only the option list is now the themed MenuDropdown. */}
            <button
              type="button"
              aria-label="Environment"
              className="text-xs font-medium cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                padding: '0.375rem 1.625rem 0.375rem 0.625rem',
                minWidth: '8.125rem',
                textAlign: 'left',
                fontFamily: 'inherit',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                paddingRight: '1.625rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 0.1875rem color-mix(in srgb, var(--oc-brand) 12%, transparent)';
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseEnter={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--oc-text) 15%, transparent)';
                }
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
            >
              {selectedEnvironment || 'No Environment'}
            </button>
          </MenuDropdown>
        )}
      </div>
    </div>
  );
};

export default RequestHeader;
