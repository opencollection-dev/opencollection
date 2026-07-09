import React, { useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { StyledWrapper } from './StyledWrapper';
import { KeyValueRow } from '../../../../../../ui/KeyValueTable/KeyValueTable';
import HeadersTab from '../../Common/HeadersTab';
import ParamsTab from '../../Common/ParamsTab';
import BodyTab from '../../Common/BodyTab';
import AuthTab from '../../Common/AuthTab';
import ScriptsTab from '../../Common/ScriptsTab';
import TestsTab from '../../Common/TestsTab';
import AssertsTab from '../../Common/AssertsTab';
import VariablesTab from '../../Common/VariablesTab';
import { 
  getHttpParams, 
  getHttpHeaders, 
  getHttpBody, 
  getRequestAuth, 
  getRequestVariables, 
  getRequestAssertions,
  getRequestScripts,
  scriptsArrayToObject,
  scriptsObjectToArray,
  getRequestUrl
} from '../../../../../../utils/schemaHelpers';
import { setUrlQueryParams } from '../../../../../../utils/pathParams';

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('params');

  const handleParamsChange = (params: KeyValueRow[]) => {
    const updatedParams = params.map(p => ({
      name: p?.name,
      value: p?.value,
      disabled: !p?.enabled,
      type: p?.type
    }));
    const url = setUrlQueryParams(getRequestUrl(item), updatedParams);
    onItemChange({
      ...item, 
      http: { 
        ...item.http, 
        params: updatedParams,
        url
      }
    });
  };

  const handleHeadersChange = (headers: KeyValueRow[]) => {
    const updatedHeaders = headers.map(h => ({
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

  const handleRequestVariablesChange = (variables: KeyValueRow[]) => {
    const updatedVariables = variables.map(v => ({
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

  const bodyType = !body
    ? 'none'
    : 'type' in body
      ? body.type
      : Array.isArray(body)
        ? 'form-urlencoded'
        : 'none';

  const handleBodyTypeChange = (type: string) => {
    if (type === 'none') {
      onItemChange({ ...item, http: { ...item.http, body: undefined } });
    } else if (type === 'form-urlencoded') {
      onItemChange({ ...item, http: { ...item.http, body: [] as any } });
    } else {
      onItemChange({ ...item, http: { ...item.http, body: { type: type as any, data: '' } } });
    }
  };

  const renderBodyTypeSelect = () => (
    <div className="body-type-select">
      <span className="glyph">{'{ }'}</span>
      <select value={bodyType} onChange={(e) => handleBodyTypeChange(e.target.value)}>
        <option value="none">None</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        <option value="xml">XML</option>
        <option value="form-urlencoded">Form URL Encoded</option>
        <option value="sparql">SPARQL</option>
      </select>
      <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="var(--oc-colors-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );

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

  // Calculate content indicators
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
      rightElement: renderBodyTypeSelect(),
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
    <StyledWrapper>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </StyledWrapper>
  );
};

export default RequestPane; 