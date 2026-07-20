import React from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import { ExampleCard } from './ExampleCard/ExampleCard';
import { StyledWrapper } from './StyledWrapper';

interface ExamplesProps {
  examples?: HttpRequestExample[];
  method: string;
  url: string;
  // Open the playground on a given example (its Try action).
  onTryExample?: (index: number) => void;
  highlightedIndex?: number;
  className?: string;
  testId?: string;
}

export const Examples: React.FC<ExamplesProps> = ({ examples, method, url, onTryExample, highlightedIndex, className, testId = 'request-examples' }) => {
  if (!examples || examples.length === 0) return null;

  // A highlight that no longer resolves (out of range) falls back to the
  // default of opening the first card, never leaving every card collapsed.
  const validHighlight =
    highlightedIndex != null && highlightedIndex >= 0 && highlightedIndex < examples.length;

  return (
    <StyledWrapper className={['examples', className].filter(Boolean).join(' ')} data-testid={testId}>
      {examples.map((example, index) => (
        <ExampleCard
          key={`${example.name ?? 'example'}-${index}`}
          example={example}
          method={method}
          url={url}
          onTry={onTryExample ? () => onTryExample(index) : undefined}
          defaultExpanded={validHighlight ? highlightedIndex === index : index === 0}
          active={validHighlight && highlightedIndex === index}
        />
      ))}
    </StyledWrapper>
  );
};

export default Examples;
