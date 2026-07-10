import { useMarkdownRenderer } from '../../../../../../hooks';
import { useMemo } from 'react';
import { StyledWrapper } from './StyledWrapper';

const OverviewTab: React.FC<{ docs?: string }> = ({ docs }) => {
  const md = useMarkdownRenderer();
  const docsHtml = useMemo(() => {
    return docs ? md.render(docs) : undefined;
  }, [md, docs]);

  return (
    <StyledWrapper
      className="markdown-documentation"
      data-testid="overview-markdown-documentation"
      dangerouslySetInnerHTML={{ __html: docsHtml ?? 'No documentation found.' }}
    />
  );
};

export default OverviewTab;
