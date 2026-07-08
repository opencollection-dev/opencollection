import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import { getItemName } from '../../../../../../../utils/schemaHelpers';

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
  readOnlyEnvironment = false
}) => {
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
    </div>
  );
};

export default RequestHeader; 