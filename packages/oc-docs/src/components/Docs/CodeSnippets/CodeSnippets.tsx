import React from 'react';
import { TabGroup } from '../../../ui/MinimalComponents';
import { Code } from '../../../ui/Code/Code';
import { StyledWrapper } from './StyledWrapper';
import { generateCurlCommand, generateJavaScriptCode, generatePythonCode } from './generateCodeSnippets';

interface CodeSnippetsProps {
  method: string;
  url: string;
  headers?: Array<{ name: string; value: string; disabled?: boolean }>;
  body?: { type?: string; data?: string };
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = ({
  method,
  url,
  headers = [],
  body
}) => {
  const snippetInput = { method, url, headers, body };

  const tabDefinitions = [
    {
      id: 'curl',
      label: 'cURL',
      code: generateCurlCommand(snippetInput),
      language: 'bash',
    },
    {
      id: 'javascript',
      label: 'JavaScript',
      code: generateJavaScriptCode(snippetInput),
      language: 'javascript',
    },
    {
      id: 'python',
      label: 'Python',
      code: generatePythonCode(snippetInput),
      language: 'python',
    },
  ];

  return (
    <StyledWrapper>
      <div className="code-example-section">
        <h3 className="section-title">Code Snippet</h3>
        <div className="code-example-card">
          <TabGroup
            tabs={tabDefinitions.map(({ id, label }) => ({ id, label }))}
            defaultTab="curl"
            renderContent={(activeTab: string) => {
              const tab =
                tabDefinitions.find(({ id }) => id === activeTab) ??
                tabDefinitions[0];

              return (
                <ExampleCodeContent
                  code={tab?.code || ''}
                  language={tab?.language || 'text'}
                />
              );
            }}
          />
        </div>
      </div>
    </StyledWrapper>
  );
};

const ExampleCodeContent: React.FC<{ code: string; language: string }> = ({
  code,
  language
}) => {
  return (
    <div className="code-example-code-wrapper">
      <Code
        code={code}
        language={language}
      />
    </div>
  );
};

