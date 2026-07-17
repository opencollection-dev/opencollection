import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import { getItemName } from '../../../../../../../utils/schemaHelpers';
import { Heading } from '../../../../../../Heading/Heading';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
  toggleRunnerMode?: () => void;
  readOnlyEnvironment?: boolean;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ item }) => {
  const itemName = getItemName(item) || 'Untitled Request';

  return (
    <div 
      className="flex items-center justify-between my-4"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Heading as="h2" size="md" className="truncate">
          {itemName}
        </Heading>
      </div>
    </div>
  );
};

export default RequestHeader; 