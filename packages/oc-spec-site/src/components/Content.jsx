import React from 'react'
import Introduction from './sections/Introduction'
import Collection from './sections/Collection'
import Items from './sections/Items'
import HttpRequest from './sections/HttpRequest'
import Folder from './sections/Folder'
import Script from './sections/Script'
import BaseConfig from './sections/BaseConfig'
import Environments from './sections/Environments'
import Auth from './sections/Auth'
import AuthType from './sections/AuthType'
import RequestBody from './sections/RequestBody'
import BodyType from './sections/BodyType'
import Variables from './sections/Variables'
import Assertions from './sections/Assertions'
import ScriptsLifecycle from './sections/ScriptsLifecycle'
import PropertyTable from './PropertyTable'
import CodeBlock from './CodeBlock'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'

function Content({ section, schema }) {
  const theme = useTheme();
  const { sidebar } = theme;
  const renderSection = () => {
    switch(section) {
      case 'introduction':
        return <Introduction />
      case 'collection':
        return <Collection schema={schema} />
      case 'items':
        return <Items />
      case 'http-request':
      case 'http-request-info':
      case 'http-request-details':
      case 'http-request-runtime':
      case 'http-request-settings':
        return <HttpRequest schema={schema} section={section} />
      case 'graphql-request':
      case 'graphql-request-info':
      case 'graphql-request-details':
      case 'graphql-request-runtime':
      case 'graphql-request-settings':
        return <GraphQLRequest schema={schema} section={section} />
      case 'grpc-request':
      case 'grpc-request-info':
      case 'grpc-request-details':
      case 'grpc-request-runtime':
        return <GrpcRequest schema={schema} section={section} />
      case 'websocket-request':
      case 'websocket-request-info':
      case 'websocket-request-details':
      case 'websocket-request-runtime':
        return <WebSocketRequest schema={schema} section={section} />
      case 'folder':
        return <Folder schema={schema} />
      case 'script':
        return <Script schema={schema} />
      case 'base-config':
        return <BaseConfig schema={schema} />
      case 'environments':
        return <Environments schema={schema} />
      case 'auth':
        return <Auth />
      case 'auth-awsv4':
      case 'auth-basic':
      case 'auth-bearer':
      case 'auth-digest':
      case 'auth-apikey':
      case 'auth-ntlm':
      case 'auth-wsse':
        return <AuthType authType={section} schema={schema} />
      case 'auth-oauth2':
      case 'oauth2-client-credentials':
      case 'oauth2-resource-owner':
      case 'oauth2-authorization-code':
      case 'oauth2-implicit':
        return <AuthType authType="auth-oauth2" schema={schema} />
      case 'request-body':
        return <RequestBody />
      case 'raw-body':
      case 'form-urlencoded':
      case 'multipart-form':
      case 'file-body':
        return <BodyType bodyType={section} schema={schema} />
      case 'variables':
        return <Variables schema={schema} />
      case 'assertions':
        return <Assertions schema={schema} />
      case 'scripts-lifecycle':
        return <ScriptsLifecycle schema={schema} />
      default:
        return <Introduction />
    }
  }

  return (
    <main className={cn(sidebar.margin, 'flex-1 min-h-screen')}>
      <div className="max-w-4xl p-6">
        {renderSection()}
      </div>
    </main>
  )
}

function GraphQLRequest({ schema, section }) {
  const graphqlRequest = schema.$defs.GraphQLRequest;
  const graphqlRequestInfo = schema.$defs.GraphQLRequestInfo;
  const graphqlRequestDetails = schema.$defs.GraphQLRequestDetails;
  const graphqlRequestRuntime = schema.$defs.GraphQLRequestRuntime;
  const graphqlRequestSettings = schema.$defs.GraphQLRequestSettings;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `info:
  name: Get Users Query
  type: graphql

graphql:
  method: POST
  url: "{{baseUrl}}/graphql"
  body:
    query: |
      query GetUsers {
        users {
          id
          name
        }
      }
    variables: "{}"

runtime:
  variables: []
  scripts: []
  assertions: []

settings:
  encodeUrl: true
  timeout: 30000`;

  const infoExample = `info:
  name: Get Users Query
  description: Fetches all users via GraphQL
  type: graphql
  seq: 1
  tags:
    - users
    - graphql`;

  const graphqlDetailsExample = `graphql:
  method: POST
  url: "{{baseUrl}}/graphql"
  headers:
    - name: Authorization
      value: "Bearer {{token}}"
  body:
    query: |
      query GetUsers($limit: Int) {
        users(limit: $limit) {
          id
          name
          email
        }
      }
    variables: |
      {
        "limit": 10
      }`;

  const runtimeExample = `runtime:
  variables:
    - name: userId
      value: "123"
  scripts:
    - type: before-request
      code: |
        bru.setVar('timestamp', Date.now());
    - type: after-response
      code: |
        bru.setVar('users', res.body.data.users);
  assertions:
    - expression: res.status
      operator: equals
      value: "200"
  auth:
    type: bearer
    token: "{{authToken}}"`;

  const settingsExample = `settings:
  encodeUrl: true
  timeout: 30000
  followRedirects: true
  maxRedirects: 5`;

  return (
    <section>
      {/* Main GraphQL Request Section */}
      <div id="graphql-request">
        <h2 className={typography.heading.h2}>GraphQL Request</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{graphqlRequest.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={graphqlRequest.properties}
          order={['info', 'graphql', 'runtime', 'settings', 'docs']}
          required={graphqlRequest.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={example} language="yaml" />
      </div>

      {/* GraphQL Request Info Section */}
      <div id="graphql-request-info" className="section-divider">
        <h2 className={typography.heading.h2}>GraphQL Request Info</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{graphqlRequestInfo.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={graphqlRequestInfo.properties}
          order={['name', 'description', 'type', 'seq', 'tags']}
          required={graphqlRequestInfo.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={infoExample} language="yaml" />
      </div>

      {/* GraphQL Request Details Section */}
      <div id="graphql-request-details" className="section-divider">
        <h2 className={typography.heading.h2}>GraphQL Request Details</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{graphqlRequestDetails.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={graphqlRequestDetails.properties}
          order={['method', 'url', 'headers', 'params', 'body']}
          required={graphqlRequestDetails.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={graphqlDetailsExample} language="yaml" />
      </div>

      {/* GraphQL Request Runtime Section */}
      <div id="graphql-request-runtime" className="section-divider">
        <h2 className={typography.heading.h2}>GraphQL Request Runtime</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{graphqlRequestRuntime.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={graphqlRequestRuntime.properties}
          order={['variables', 'scripts', 'assertions', 'auth']}
          required={graphqlRequestRuntime.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={runtimeExample} language="yaml" />
      </div>

      {/* GraphQL Request Settings Section */}
      <div id="graphql-request-settings" className="section-divider">
        <h2 className={typography.heading.h2}>GraphQL Request Settings</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{graphqlRequestSettings.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={graphqlRequestSettings.properties}
          order={['encodeUrl', 'timeout', 'followRedirects', 'maxRedirects']}
          required={graphqlRequestSettings.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={settingsExample} language="yaml" />
      </div>
    </section>
  )
}

function GrpcRequest({ schema, section }) {
  const grpcRequest = schema.$defs.GrpcRequest;
  const grpcRequestInfo = schema.$defs.GrpcRequestInfo;
  const grpcRequestDetails = schema.$defs.GrpcRequestDetails;
  const grpcRequestRuntime = schema.$defs.GrpcRequestRuntime;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `info:
  name: Get User
  type: grpc

grpc:
  url: "{{baseUrl}}:50051"
  method: "user.UserService/GetUser"
  methodType: unary
  protoFilePath: "./proto/user.proto"
  message: |
    {
      "id": "123"
    }

runtime:
  variables: []
  scripts: []
  assertions: []`;

  const infoExample = `info:
  name: Get User
  description: Fetches a user by ID via gRPC
  type: grpc
  seq: 1
  tags:
    - users
    - grpc`;

  const grpcDetailsExample = `grpc:
  url: "{{baseUrl}}:50051"
  method: "user.UserService/GetUser"
  methodType: unary
  protoFilePath: "./proto/user.proto"
  metadata:
    - name: authorization
      value: "Bearer {{token}}"
  message: |
    {
      "id": "123"
    }`;

  const runtimeExample = `runtime:
  variables:
    - name: userId
      value: "123"
  scripts:
    - type: before-request
      code: |
        bru.setVar('timestamp', Date.now());
    - type: after-response
      code: |
        bru.setVar('user', res.body);
  assertions:
    - expression: res.status
      operator: equals
      value: "0"
  auth:
    type: bearer
    token: "{{authToken}}"`;

  return (
    <section>
      {/* Main gRPC Request Section */}
      <div id="grpc-request">
        <h2 className={typography.heading.h2}>gRPC Request</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{grpcRequest.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={grpcRequest.properties}
          order={['info', 'grpc', 'runtime', 'docs']}
          required={grpcRequest.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={example} language="yaml" />
      </div>

      {/* gRPC Request Info Section */}
      <div id="grpc-request-info" className="section-divider">
        <h2 className={typography.heading.h2}>gRPC Request Info</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{grpcRequestInfo.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={grpcRequestInfo.properties}
          order={['name', 'description', 'type', 'seq', 'tags']}
          required={grpcRequestInfo.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={infoExample} language="yaml" />
      </div>

      {/* gRPC Request Details Section */}
      <div id="grpc-request-details" className="section-divider">
        <h2 className={typography.heading.h2}>gRPC Request Details</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{grpcRequestDetails.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={grpcRequestDetails.properties}
          order={['url', 'method', 'methodType', 'protoFilePath', 'metadata', 'message']}
          required={grpcRequestDetails.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={grpcDetailsExample} language="yaml" />
      </div>

      {/* gRPC Request Runtime Section */}
      <div id="grpc-request-runtime" className="section-divider">
        <h2 className={typography.heading.h2}>gRPC Request Runtime</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{grpcRequestRuntime.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={grpcRequestRuntime.properties}
          order={['variables', 'scripts', 'assertions', 'auth']}
          required={grpcRequestRuntime.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={runtimeExample} language="yaml" />
      </div>
    </section>
  )
}

function WebSocketRequest({ schema, section }) {
  const websocketRequest = schema.$defs.WebSocketRequest;
  const websocketRequestInfo = schema.$defs.WebSocketRequestInfo;
  const websocketRequestDetails = schema.$defs.WebSocketRequestDetails;
  const websocketRequestRuntime = schema.$defs.WebSocketRequestRuntime;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `info:
  name: Chat Connection
  type: websocket

websocket:
  url: "ws://{{baseUrl}}/chat"
  headers:
    - name: Authorization
      value: "Bearer {{token}}"
  message:
    type: json
    data: |
      {
        "action": "subscribe",
        "channel": "general"
      }

runtime:
  variables: []
  scripts: []`;

  const infoExample = `info:
  name: Chat Connection
  description: WebSocket connection for real-time chat
  type: websocket
  seq: 1
  tags:
    - chat
    - realtime`;

  const websocketDetailsExample = `websocket:
  url: "ws://{{baseUrl}}/chat"
  headers:
    - name: Authorization
      value: "Bearer {{token}}"
    - name: X-Client-Id
      value: "{{clientId}}"
  message:
    type: json
    data: |
      {
        "action": "subscribe",
        "channel": "general"
      }`;

  const runtimeExample = `runtime:
  variables:
    - name: clientId
      value: "client-123"
  scripts:
    - type: before-request
      code: |
        bru.setVar('timestamp', Date.now());
  auth:
    type: bearer
    token: "{{authToken}}"`;

  return (
    <section>
      {/* Main WebSocket Request Section */}
      <div id="websocket-request">
        <h2 className={typography.heading.h2}>WebSocket Request</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{websocketRequest.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={websocketRequest.properties}
          order={['info', 'websocket', 'runtime', 'docs']}
          required={websocketRequest.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={example} language="yaml" />
      </div>

      {/* WebSocket Request Info Section */}
      <div id="websocket-request-info" className="section-divider">
        <h2 className={typography.heading.h2}>WebSocket Request Info</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{websocketRequestInfo.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={websocketRequestInfo.properties}
          order={['name', 'description', 'type', 'seq', 'tags']}
          required={websocketRequestInfo.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={infoExample} language="yaml" />
      </div>

      {/* WebSocket Request Details Section */}
      <div id="websocket-request-details" className="section-divider">
        <h2 className={typography.heading.h2}>WebSocket Request Details</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{websocketRequestDetails.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={websocketRequestDetails.properties}
          order={['url', 'headers', 'message']}
          required={websocketRequestDetails.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={websocketDetailsExample} language="yaml" />
      </div>

      {/* WebSocket Request Runtime Section */}
      <div id="websocket-request-runtime" className="section-divider">
        <h2 className={typography.heading.h2}>WebSocket Request Runtime</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{websocketRequestRuntime.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={websocketRequestRuntime.properties}
          order={['variables', 'scripts', 'auth']}
          required={websocketRequestRuntime.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={runtimeExample} language="yaml" />
      </div>
    </section>
  )
}

export default Content