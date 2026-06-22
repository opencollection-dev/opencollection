import React from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import { ExampleCard } from './ExampleCard';
import { ExamplesWrapper } from './StyledWrapper';

interface ExamplesProps {
  examples?: HttpRequestExample[];
  method: string;
  url: string;
  onTry?: () => void;
  className?: string;
}

/** A list of saved request examples, each an expandable request/response card. */
export const Examples: React.FC<ExamplesProps> = ({ examples, method, url, onTry, className }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <ExamplesWrapper className={['oc-examples', className].filter(Boolean).join(' ')}>
      {examples.map((example, index) => (
        <ExampleCard
          key={`${example.name ?? 'example'}-${index}`}
          example={example}
          method={method}
          url={url}
          onTry={onTry}
          defaultExpanded={index === 0}
        />
      ))}
    </ExamplesWrapper>
  );
};

export default Examples;
