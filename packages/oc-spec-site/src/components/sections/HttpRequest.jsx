import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'

function HttpRequest({ schema, section }) {
  const httpRequest = schema.$defs.HttpRequest;
  const httpRequestInfo = schema.$defs.HttpRequestInfo;
  const httpRequestDetails = schema.$defs.HttpRequestDetails;
  const httpRequestRuntime = schema.$defs.HttpRequestRuntime;
  const httpRequestSettings = schema.$defs.HttpRequestSettings;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `info:
  name: Get Users
  type: http

http:
  method: GET
  url: "{{baseUrl}}/api/users"
  headers:
    - name: Authorization
      value: "Bearer {{token}}"
  params:
    - name: page
      value: "1"
      type: query

runtime:
  variables: []
  scripts: []
  assertions: []

settings:
  encodeUrl: true
  timeout: 30000`;

  const infoExample = `info:
  name: Get Users
  description: Fetches all users from the API
  type: http
  seq: 1
  tags:
    - users
    - api`;

  const httpDetailsExample = `http:
  method: GET
  url: "{{baseUrl}}/api/users"
  headers:
    - name: Authorization
      value: "Bearer {{token}}"
    - name: Content-Type
      value: application/json
  params:
    - name: page
      value: "1"
      type: query
    - name: limit
      value: "10"
      type: query`;

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
        bru.setVar('token', res.body.token);
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
      {/* Main HTTP Request Section */}
      <div id="http-request">
        <h2 className={typography.heading.h2}>HTTP Request</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{httpRequest.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={httpRequest.properties}
          order={['info', 'http', 'runtime', 'settings', 'examples', 'docs']}
          required={httpRequest.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={example} language="yaml" />
      </div>

      {/* HTTP Request Info Section */}
      <div id="http-request-info" className="section-divider">
        <h2 className={typography.heading.h2}>HTTP Request Info</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{httpRequestInfo.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={httpRequestInfo.properties}
          order={['name', 'description', 'type', 'seq', 'tags']}
          required={httpRequestInfo.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={infoExample} language="yaml" />
      </div>

      {/* HTTP Request Details Section */}
      <div id="http-request-details" className="section-divider">
        <h2 className={typography.heading.h2}>HTTP Request Details</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{httpRequestDetails.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={httpRequestDetails.properties}
          order={['method', 'url', 'headers', 'params', 'body']}
          required={httpRequestDetails.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={httpDetailsExample} language="yaml" />
      </div>

      {/* HTTP Request Runtime Section */}
      <div id="http-request-runtime" className="section-divider">
        <h2 className={typography.heading.h2}>HTTP Request Runtime</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{httpRequestRuntime.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={httpRequestRuntime.properties}
          order={['variables', 'scripts', 'assertions', 'auth']}
          required={httpRequestRuntime.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={runtimeExample} language="yaml" />
      </div>

      {/* HTTP Request Settings Section */}
      <div id="http-request-settings" className="section-divider">
        <h2 className={typography.heading.h2}>HTTP Request Settings</h2>
        <p className={`${typography.body.default} ${spacing.element}`}>{httpRequestSettings.description}</p>
        
        <h3 className={typography.heading.h3}>Properties</h3>
        <PropertyTable 
          properties={httpRequestSettings.properties}
          order={['encodeUrl', 'timeout', 'followRedirects', 'maxRedirects']}
          required={httpRequestSettings.required}
        />
        
        <h3 className={typography.heading.h3}>Example</h3>
        <CodeBlock code={settingsExample} language="yaml" />
      </div>
    </section>
  )
}

export default HttpRequest