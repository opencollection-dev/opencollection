import React, { useMemo } from 'react';
import { Breadcrumb, type BreadcrumbSegment } from '../../../ui/Breadcrumb/Breadcrumb';
import { Item } from '@opencollection/types/collection/item';
import { OpenCollection } from '@opencollection/types';
import { buildBreadcrumbSegments } from '../../../utils/common';

export interface BreadcrumbWrapperProps {
  showBreadcrumbs: boolean;
  name: string;
  collection?: OpenCollection | null;
  ancestry?: Item[];
  onBreadcrumbClick?: (uuid: string) => void;
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({
  showBreadcrumbs,
  name,
  collection,
  ancestry = [],
  onBreadcrumbClick
}) => {
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
