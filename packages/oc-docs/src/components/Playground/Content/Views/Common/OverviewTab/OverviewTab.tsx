import { useMarkdownRenderer } from '../../../../../../hooks';
import { useMemo } from 'react';
import { StyledWrapper } from './StyledWrapper';
import { EmptyState } from '../../../../../../ui/EmptyState/EmptyState';
import { BookIcon } from '../../../../../../assets/icons';

const OverviewTab: React.FC<{ docs?: string }> = ({ docs }) => {
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
        subheading="This collection has no description or readme. Add one in Bruno to introduce your API to readers: what it does, who it's for, and how to authenticate."
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
