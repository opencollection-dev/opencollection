import React, { useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { type EditableTableRow } from '../../../../../../ui/EditableTable';
import { HeadersTab, ParamsTab, BodyTab, AuthTab, ScriptsTab, TestsTab, AssertsTab, VariablesTab } from '../../Common';
import {
  getHttpParams,
  getHttpHeaders,
  getHttpBody,
  getRequestAuth,
  getRequestVariables,
  getRequestAssertions,
  getRequestScripts,
  scriptsArrayToObject,
  scriptsObjectToArray
} from '../../../../../../utils/schemaHelpers';

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('params');

  const handleParamsChange = (params: EditableTableRow[]) => {
    const updatedParams = params.map(p => ({
      uid: p.uid,
      name: p.name,
      value: p.value,
      disabled: !p.enabled,
      type: 'query' as const
    }));
    onItemChange({
      ...item,
      http: {
        ...item.http,
        params: updatedParams
      }
    });
  };

  const handleHeadersChange = (headers: EditableTableRow[]) => {
    const updatedHeaders = headers.map(h => ({
      uid: h.uid,
      name: h.name,
      value: h.value,
      disabled: !h.enabled
    }));
    onItemChange({
      ...item,
      http: {
        ...item.http,
        headers: updatedHeaders
      }
    });
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const scriptsObj = scriptsArrayToObject(getRequestScripts(item));
    const updatedScriptsObj = { ...scriptsObj, [scriptType]: value };
    onItemChange({
      ...item,
      runtime: {
        ...item.runtime,
        scripts: scriptsObjectToArray(updatedScriptsObj)
      }
    });
  };

  const handleAssertionsChange = (assertions: Assertion[]) => {
    onItemChange({
      ...item,
      runtime: {
        ...item.runtime,
        assertions
      }
    });
  };

  const handleRequestVariablesChange = (variables: EditableTableRow[]) => {
    const updatedVariables = variables.map(v => ({
      uid: v.uid,
      name: v.name,
      value: v.value,
      disabled: !v.enabled
    }));
    onItemChange({
      ...item,
      runtime: {
        ...item.runtime,
        variables: updatedVariables
      }
    });
  };

  // Get values using helper functions
  const params = getHttpParams(item);
  const headers = getHttpHeaders(item);
  const body = getHttpBody(item);
  const auth = getRequestAuth(item);
  const variables = getRequestVariables(item);
  const assertions = getRequestAssertions(item);
  const scriptsObj = scriptsArrayToObject(getRequestScripts(item));

  const renderParams = () => (
    <ParamsTab
      params={params}
      onParamsChange={handleParamsChange}
    />
  );

  const renderVariables = () => (
    <VariablesTab
      variables={variables}
      onVariablesChange={handleRequestVariablesChange}
      title="Request Variables"
      description="These variables will be available to this request"
    />
  );

  const renderHeaders = () => (
    <HeadersTab
      headers={headers}
      onHeadersChange={handleHeadersChange}
    />
  );

  const renderBody = () => (
    <BodyTab
      body={body}
      onItemChange={onItemChange}
      item={item}
    />
  );

  const renderAuth = () => (
    <AuthTab
      auth={auth}
      onAuthChange={() => {}} // Not used for full auth
      onItemChange={onItemChange}
      item={item}
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={scriptsObj}
      onScriptChange={handleScriptChange}
      showTests={false}
    />
  );

  const renderAssertions = () => (
    <AssertsTab
      assertions={assertions}
      onAssertionsChange={handleAssertionsChange}
    />
  );

  const renderTests = () => (
    <TestsTab
      scripts={scriptsObj}
      onScriptChange={handleScriptChange}
    />
  );

  const hasBody = body && (
    (body as any).data || 
    (Array.isArray(body) && body.length > 0)
  );
  const hasScripts = scriptsObj && (
    scriptsObj.preRequest || 
    scriptsObj.postResponse
  );
  const hasTests = scriptsObj?.tests;

  const tabs = [
    { 
      id: 'params', 
      label: 'Params', 
      contentIndicator: params?.length || undefined, 
      content: <div className="py-3">{renderParams()}</div> 
    },
    { 
      id: 'variables', 
      label: 'Variables', 
      contentIndicator: variables?.length || undefined,
      content: <div className="py-3">{renderVariables()}</div>
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: headers?.length || undefined, 
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
      contentIndicator: auth ? '•' : undefined,
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
      contentIndicator: assertions?.length || undefined, 
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