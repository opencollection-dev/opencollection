import React, { useMemo } from 'react';
import { getItemName } from 'src/utils/schemaHelpers';
import { Breadcrumb, type BreadcrumbSegment } from '../../../ui/Breadcrumb/Breadcrumb';
import { Item } from '@opencollection/types/collection/item';
import { OpenCollection } from '@opencollection/types';
import { buildBreadcrumbSegments } from '../../../utils/common';

export interface BreadcrumbWrapperProps {
  showBreadcrumbs: boolean;
  item: Item;
  customName?: string;
  collection?: OpenCollection | null;
  ancestry?: Item[];
  onBreadcrumbClick?: (uuid: string) => void;
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({
  showBreadcrumbs,
  item,
  collection,
  ancestry = [],
  customName,
  onBreadcrumbClick
}) => {
  const name = getItemName(item) || customName;
  const segments = useMemo<BreadcrumbSegment[]>(
    () => (showBreadcrumbs ? buildBreadcrumbSegments(collection, ancestry) : []),
    [collection, ancestry, showBreadcrumbs]
  );

  if (!showBreadcrumbs) {
    return null;
  }

  return (
    <Breadcrumb
      segments={segments}
      current={name}
      onSegmentClick={onBreadcrumbClick}
      testId="unsupported-request-breadcrumb"
    />
  );
};

export default BreadcrumbWrapper;