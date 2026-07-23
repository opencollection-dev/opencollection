import React, { useState } from 'react';
import CodeEditor from '../../../../../../ui/CodeEditor/CodeEditor';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { StyledWrapper } from './StyledWrapper';

type ScriptSubTab = 'pre-request' | 'post-response';

interface ScriptsTabProps {
  scripts: {
    preRequest?: string;
    postResponse?: string;
    tests?: string;
  };
  onScriptChange: (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => void;
  title?: string;
  description?: string;
  showTests?: boolean;
  fillHeight?: boolean;
}

export const ScriptsTab: React.FC<ScriptsTabProps> = ({
  scripts,
  onScriptChange,
  title,
  description,
  showTests = true,
  fillHeight = false
}) => {
  const [activeScriptTab, setActiveScriptTab] = useState<ScriptSubTab>('pre-request');

  const tabs: {
    id: ScriptSubTab;
    label: string;
    content: React.ReactNode;
  }[] = [
    {
      id: 'pre-request',
      label: 'Pre request',
      content: (
        <CodeEditor
          value={scripts.preRequest || ''}
          onChange={(value: string) => onScriptChange('preRequest', value)}
          language="javascript"
          height={fillHeight ? '100%' : '300px'}
          hintsFor={['req', 'bru']}
          active={activeScriptTab === 'pre-request'}
          testId="scripts-editor-pre-request"
        />
      )
    },
    {
      id: 'post-response',
      label: 'Post response',
      content: (
        <CodeEditor
          value={scripts.postResponse || ''}
          onChange={(value: string) => onScriptChange('postResponse', value)}
          language="javascript"
          height={fillHeight ? '100%' : '300px'}
          hintsFor={['req', 'res', 'bru']}
          active={activeScriptTab === 'post-response'}
          testId="scripts-editor-post-response"
        />
      )
    }
  ];

  return (
    <StyledWrapper className={`space-y-4${fillHeight ? ' h-full flex flex-col' : ''}`}>
      {(Boolean(title) || Boolean(description)) && (
        <div className="flex items-center justify-between mb-4">
          {title && <span className="title text-sm font-semibold">{title}</span>}
          {description && <span className="description text-xs leading-tight">{description}</span>}
        </div>
      )}

      <div className={`space-y-4${fillHeight ? ' flex-1 min-h-0 flex flex-col' : ''}`}>
        <Tabs
          tabs={tabs}
          activeTab={activeScriptTab}
          onTabChange={(selectedTabId) => setActiveScriptTab(selectedTabId as ScriptSubTab)}
          variant="button"
          keepMounted
          testId="scripts-tabs"
        />

        {showTests && (
          <div>
            <label className="label block text-sm font-medium mb-2">Tests</label>
            <CodeEditor
              value={scripts.tests || ''}
              onChange={(value: string) => onScriptChange('tests', value)}
              language="javascript"
              height="150px"
              hintsFor={['req', 'res', 'bru']}
            />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default ScriptsTab;
