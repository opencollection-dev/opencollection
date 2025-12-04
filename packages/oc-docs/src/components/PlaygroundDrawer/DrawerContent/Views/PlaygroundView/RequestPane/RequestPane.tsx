import React, { useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { KeyValueRow } from '../../../../../../ui/KeyValueTable/KeyValueTable';
import { HeadersTab, ParamsTab, BodyTab, AuthTab, ScriptsTab, TestsTab, AssertsTab, VariablesTab } from '../../Common';

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('params');

  const handleParamsChange = (params: KeyValueRow[]) => {
    const updatedParams = params.map(p => ({
      name: p.name,
      value: p.value,
      disabled: !p.enabled,
      type: 'query' as const
    }));
    onItemChange({ ...item, params: updatedParams });
  };

  const handleHeadersChange = (headers: KeyValueRow[]) => {
    const updatedHeaders = headers.map(h => ({
      name: h.name,
      value: h.value,
      disabled: !h.enabled
    }));
    onItemChange({ ...item, headers: updatedHeaders });
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const scripts = item.scripts || {};
    onItemChange({
      ...item,
      scripts: { ...scripts, [scriptType]: value }
    });
  };

  const handleAssertionsChange = (assertions: Assertion[]) => {
    onItemChange({ ...item, assertions });
  };

  const handleRequestVariablesChange = (variables: KeyValueRow[]) => {
    onItemChange({ ...item, variables });
    const updatedVariables = variables.map(v => ({
      name: v.name,
      value: v.value,
      disabled: !v.enabled
    }));
    onItemChange({ ...item, variables: updatedVariables });
  };

  const renderParams = () => (
    <ParamsTab
      params={item.params || []}
      onParamsChange={handleParamsChange}
    />
  );

  const renderVariables = () => (
    <VariablesTab
      variables={item.variables || []}
      onVariablesChange={handleRequestVariablesChange}
      title="Request Variables"
      description="These variables will be available to this request"
    />
  );

  const renderHeaders = () => (
    <HeadersTab
      headers={item.headers || []}
      onHeadersChange={handleHeadersChange}
    />
  );

  const renderBody = () => (
    <BodyTab
      body={item.body}
      onItemChange={onItemChange}
      item={item}
    />
  );

  const renderAuth = () => (
    <AuthTab
      auth={item.auth}
      onAuthChange={() => {}} // Not used for full auth
      onItemChange={onItemChange}
      item={item}
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={item.scripts || {}}
      onScriptChange={handleScriptChange}
      showTests={false}
    />
  );

  const renderAssertions = () => (
    <AssertsTab
      assertions={item.assertions || []}
      onAssertionsChange={handleAssertionsChange}
    />
  );

  const renderTests = () => (
    <TestsTab
      scripts={item.scripts || {}}
      onScriptChange={handleScriptChange}
    />
  );

  // Calculate content indicators
  const hasBody = item.body && (
    (item.body as any).data || 
    (Array.isArray(item.body) && item.body.length > 0)
  );
  const hasScripts = item.scripts && (
    item.scripts.preRequest || 
    item.scripts.postResponse
  );
  const hasTests = item.scripts?.tests;

  const tabs = [
    { 
      id: 'params', 
      label: 'Params', 
      contentIndicator: item.params?.length || undefined, 
      content: <div className="py-3">{renderParams()}</div> 
    },
    { 
      id: 'variables', 
      label: 'Variables', 
      contentIndicator: item.variables?.length || undefined,
      content: <div className="py-3">{renderVariables()}</div>
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: item.headers?.length || undefined, 
      content: <div className="py-3">{renderHeaders()}</div> 
    },
    { 
      id: 'body', 
      label: 'Body',
      contentIndicator: hasBody ? '•' : undefined,
      content: <div className="py-3">{renderBody()}</div> 
    },
    { 
      id: 'auth', 
      label: 'Auth',
      contentIndicator: item.auth ? '•' : undefined,
      content: <div className="py-3">{renderAuth()}</div> 
    },
    { 
      id: 'scripts', 
      label: 'Scripts',
      contentIndicator: hasScripts ? '•' : undefined,
      content: <div className="py-3">{renderScripts()}</div> 
    },
    { 
      id: 'assertions', 
      label: 'Assertions', 
      contentIndicator: item.assertions?.length || undefined, 
      content: <div className="py-3">{renderAssertions()}</div> 
    },
    { 
      id: 'tests', 
      label: 'Tests',
      contentIndicator: hasTests ? '•' : undefined,
      content: <div className="py-3">{renderTests()}</div> 
    }
  ];

  return (
    <div className="h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default RequestPane; 