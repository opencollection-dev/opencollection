import React, { useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import Dropdown from '../../../../../../ui/Dropdown/Dropdown';
import { StyledWrapper } from './StyledWrapper';
import { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { rowToVariable } from '../../../../../../utils/variableDataType';
import HeadersTab from '../../Common/HeadersTab/HeadersTab';
import ParamsTab from '../../Common/ParamsTab';
import BodyTab from '../../Common/BodyTab';
import AuthTab from '../../Common/AuthTab/AuthTab';
import ScriptsTab from '../../Common/ScriptsTab/ScriptsTab';
import TestsTab from '../../Common/TestsTab/TestsTab';
import AssertsTab from '../../Common/AssertsTab';
import VariablesTab from '../../Common/VariablesTab/VariablesTab';
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
import { actionsToPostResponseVars, postResponseVarsToActions } from '../../../../../../utils/request';

const BODY_TYPES = [
  { id: 'none', label: 'No Body' },
  { id: 'json', label: 'JSON' },
  { id: 'text', label: 'Text' },
  { id: 'xml', label: 'XML' },
  { id: 'form-urlencoded', label: 'Form URL Encoded' },
  { id: 'multipart-form', label: 'Multipart Form' },
  { id: 'file', label: 'File / Binary' },
  { id: 'sparql', label: 'SPARQL' }
];

const bodyTypeLabel = (id: string): string => {
  if (id === 'json') return '{ } JSON';
  if (id === 'xml') return '</> XML';
  return BODY_TYPES.find((t) => t.id === id)?.label ?? 'No Body';
};

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('params');

  const handleParamsChange = (params: KeyValueRow[]) => {
    const originals = getHttpParams(item) as Array<{ name?: string }>;
    const originalByName = new Map(
      originals.filter((param) => param.name).map((param): [string, typeof param] => [param.name as string, param])
    );
    const updatedParams = params.map(p => ({
      ...(originalByName.get(p?.name) ?? {}),
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
    const originals = getHttpHeaders(item);
    const originalByName = new Map(
      originals.filter((header) => header.name).map((header): [string, typeof header] => [header.name as string, header])
    );
    const updatedHeaders = headers.map(h => {
      const description = 'description' in h ? h.description : originalByName.get(h.name)?.description;
      return {
        name: h.name,
        value: h.value,
        disabled: !h.enabled,
        ...(description !== undefined ? { description } : {})
      };
    });
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
    onItemChange({
      ...item,
      runtime: {
        ...item.runtime,
        variables: variables.map(rowToVariable)
      }
    });
  };

  const handlePostResponseVarsChange = (rows: KeyValueRow[]) => {
    onItemChange({
      ...item,
      runtime: { ...item.runtime, actions: postResponseVarsToActions(rows, item.runtime?.actions) }
    });
  };

  const handleBodyTypeChange = (bodyType: string) => {
    // getHttpBody falls back to a legacy root-level body, so clearing only
    // http.body lets the old body resurface — drop the root shadow too.
    const applyBody = (body: unknown) => {
      const next = { ...item, http: { ...item.http, body } } as any;
      delete next.body;
      onItemChange(next as HttpRequest);
    };
    if (bodyType === 'none') applyBody(undefined);
    else if (['json', 'text', 'xml', 'sparql'].includes(bodyType)) applyBody({ type: bodyType, data: '' });
    else if (bodyType === 'form-urlencoded') applyBody([]);
    else if (bodyType === 'multipart-form' || bodyType === 'file') applyBody({ type: bodyType, data: [] });
  };

  // Get values using helper functions
  const params = getHttpParams(item);
  const headers = getHttpHeaders(item);
  const body = getHttpBody(item);
  const auth = getRequestAuth(item);
  const variables = getRequestVariables(item);
  const postResponseVars = actionsToPostResponseVars(item.runtime?.actions);
  const assertions = getRequestAssertions(item);
  const scriptsObj = scriptsArrayToObject(getRequestScripts(item));

  const bodyType = !body ? 'none' : 'type' in body ? body.type : Array.isArray(body) ? 'form-urlencoded' : 'none';

  const renderBodyTypeSelect = () => (
    <Dropdown
      label={bodyTypeLabel(bodyType)}
      active={bodyType !== 'none'}
      menuLabel="Body type"
      align="right"
      testId="body-type-select"
    >
      {({ close }) =>
        BODY_TYPES.map((type) => (
          <li key={type.id} role="option" aria-selected={type.id === bodyType}>
            <button
              type="button"
              className={`dropdown-option${type.id === bodyType ? ' is-selected' : ''}`}
              data-testid={`body-type-option-${type.id}`}
              onClick={() => {
                handleBodyTypeChange(type.id);
                close();
              }}
            >
              <span className="dropdown-label">{type.label}</span>
            </button>
          </li>
        ))
      }
    </Dropdown>
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
      postResponseVars={postResponseVars}
      onPostResponseVarsChange={handlePostResponseVarsChange}
      title="Request Variables"
      description="These variables will be available to this request"
    />
  );

  const renderHeaders = () => (
    <HeadersTab
      headers={headers}
      onHeadersChange={handleHeadersChange}
      title="Headers"
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
      title="Authentication"
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={scriptsObj}
      onScriptChange={handleScriptChange}
      title="Scripts"
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