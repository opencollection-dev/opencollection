import { useMarkdownRenderer } from '../../../../../../hooks';
import { useMemo } from 'react';
import { StyledWrapper } from './StyledWrapper';
import { EmptyState } from '../../../../../../ui/EmptyState/EmptyState';
import { BookIcon } from '../../../../../../assets/icons';

const OverviewTab: React.FC<{ docs?: string; emptyStateSubheading: string }> = ({
  docs,
  emptyStateSubheading
}) => {
  const md = useMarkdownRenderer();
  const docsHtml = useMemo(() => {
    return docs ? md.render(docs) : undefined;
  }, [md, docs]);

  if (!docsHtml) {
    return (
      <EmptyState
        testId="overview-empty"
        icon={<BookIcon />}
        heading="No overview content yet"
        subheading={emptyStateSubheading}
      />
    );
  }

  return (
    <StyledWrapper
      className="markdown-documentation"
      data-testid="overview-markdown-documentation"
      dangerouslySetInnerHTML={{ __html: docsHtml }}
    />
  );
};

export default OverviewTab;
