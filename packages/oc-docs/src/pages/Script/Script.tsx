import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item, ScriptFile } from '@opencollection/types/collection/item';
import { getItemName } from '../../utils/schemaHelpers';
import { buildBreadcrumbSegments } from '../../utils/common';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { Code } from '../../components/Code/Code';
import { StyledWrapper } from './StyledWrapper';

interface ScriptProps {
  item: ScriptFile;
  ancestry?: Item[];
  collection?: OpenCollection | null;
  onBreadcrumbClick?: (uuid: string) => void;
  testId?: string;
}

export const Script: React.FC<ScriptProps> = ({ item, ancestry = [], collection, onBreadcrumbClick, testId = 'script-page' }) => {
  const name = getItemName(item) || 'Script';
  const code = item.script ?? '';

  const segments = useMemo<BreadcrumbSegment[]>(
    () => buildBreadcrumbSegments(collection, ancestry),
    [collection, ancestry]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="script" data-testid={testId}>
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} testId="script-breadcrumb" />

        <Heading size="md" style={{ marginTop: '0.875rem' }} testId="script-title">{name}</Heading>

        <Code code={code} language="javascript" showLineNumbers showCopy className="script-code" testId="script-code" />
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Script;
