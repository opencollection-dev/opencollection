import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import { getItemName } from '../../../../../../utils/schemaHelpers';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import { StyledWrapper } from './StyledWrapper';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
  toggleRunnerMode?: () => void;
  readOnlyEnvironment?: boolean;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ item, collection, selectedEnvironment, onEnvironmentChange }) => {
  const itemName = getItemName(item) || 'Untitled Request';

  return (
    <StyledWrapper className="flex items-center justify-between pb-5">
      <div className="flex items-center gap-2.5 min-w-0">
        <h2 className="request-title text-lg font-semibold truncate tracking-tight" title={itemName}>
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
            <button
              type="button"
              aria-label="Environment"
              className="env-select text-xs font-medium cursor-pointer transition-all duration-200"
            >
              {selectedEnvironment || 'No Environment'}
            </button>
          </MenuDropdown>
        )}
      </div>
    </StyledWrapper>
  );
};

export default RequestHeader;
