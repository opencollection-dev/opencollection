import React from 'react';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import { ExampleCard } from './ExampleCard/ExampleCard';
import { StyledWrapper } from './StyledWrapper';

interface ExamplesProps {
  examples?: HttpRequestExample[];
  method: string;
  url: string;
  onTry?: () => void;
  className?: string;
}

export const Examples: React.FC<ExamplesProps> = ({ examples, method, url, onTry, className }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <StyledWrapper className={['oc-examples', className].filter(Boolean).join(' ')}>
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
    </StyledWrapper>
  );
};

export default Examples;
