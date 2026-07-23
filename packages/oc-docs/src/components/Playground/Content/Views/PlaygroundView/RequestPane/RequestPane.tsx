import React, { useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import Tabs from '../../../../../../ui/Tabs/Tabs';
import { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { rowToVariable } from '../../../../../../utils/variableDataType';
import HeadersTab from '../../Common/HeadersTab/HeadersTab';
import ParamsTab from '../../Common/ParamsTab/ParamsTab';
import BodyTab from '../../Common/BodyTab';
import BodyModeSelector from '../../Common/BodyModeSelector/BodyModeSelector';
import AuthTab from '../../Common/AuthTab/AuthTab';
import ScriptsTab from '../../Common/ScriptsTab/ScriptsTab';
import TestsTab from '../../Common/TestsTab/TestsTab';
import AssertsTab from '../../Common/AssertsTab/AssertsTab';
import VariablesTab from '../../Common/VariablesTab/VariablesTab';
import OverviewTab from '../../Common/OverviewTab/OverviewTab';
import { StyledWrapper } from './StyledWrapper';
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
  getRequestUrl,
  getItemDocs
} from '../../../../../../utils/schemaHelpers';
import { setUrlQueryParams } from '../../../../../../utils/pathParams';
import { actionsToPostResponseVars, postResponseVarsToActions } from '../../../../../../utils/request';

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  // Get values using helper functions
  const params = getHttpParams(item);
  const headers = getHttpHeaders(item);
  const body = getHttpBody(item);
  const auth = getRequestAuth(item);
  const variables = getRequestVariables(item);
  const postResponseVars = actionsToPostResponseVars(item.runtime?.actions);
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
      postResponseVars={postResponseVars}
      onPostResponseVarsChange={handlePostResponseVarsChange}
      description="These variables will be available to this request."
    />
  );

  const renderHeaders = () => (
    <HeadersTab
      headers={headers}
      onHeadersChange={handleHeadersChange}
      description="Headers sent with this request."
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
      description="Configures authentication for this request."
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={scriptsObj}
      onScriptChange={handleScriptChange}
      description="Pre and post-request scripts that run before and after this request is sent."
      showTests={false}
    />
  );

  const renderAssertions = () => (
    <AssertsTab
      assertions={assertions}
      onAssertionsChange={handleAssertionsChange}
      title=""
      description="Assertions that validate the response of this request."
    />
  );

  const renderTests = () => (
    <TestsTab
      scripts={scriptsObj}
      onScriptChange={handleScriptChange}
      description="These tests run every time this request is sent."
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
      id: 'overview',
      label: 'Overview',
      content: (
        <OverviewTab
          docs={getItemDocs(item)}
          emptyStateSubheading="This request has no docs. Add one in Bruno to introduce your API to readers: what it does, who it's for, and how to authenticate."
          displayEmptyStateBox={false}
        />
      )
    },
    {
      id: 'params',
      label: 'Params',
      contentIndicator: params?.length || undefined, 
      content: renderParams()
    },
    { 
      id: 'variables', 
      label: 'Variables', 
      contentIndicator: variables?.length || undefined,
      content: renderVariables()
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: headers?.length || undefined, 
      content: renderHeaders()
    },
    {
      id: 'body',
      label: 'Body',
      contentIndicator: hasBody ? '•' : undefined,
      rightElement: <BodyModeSelector body={body} onItemChange={onItemChange} item={item} />,
      content: renderBody()
    },
    { 
      id: 'auth', 
      label: 'Auth',
      contentIndicator: auth ? '•' : undefined,
      content: renderAuth()
    },
    { 
      id: 'scripts', 
      label: 'Scripts',
      contentIndicator: hasScripts ? '•' : undefined,
      content: renderScripts()
    },
    { 
      id: 'assertions', 
      label: 'Assertions', 
      contentIndicator: assertions?.length || undefined, 
      content: renderAssertions()
    },
    { 
      id: 'tests', 
      label: 'Tests',
      contentIndicator: hasTests ? '•' : undefined,
      content: renderTests()
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