import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
// Import Prism and language components to ensure they're bundled
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';
import OpenCollection from './components/OpenCollection/OpenCollection';
import { createOpenCollectionStore } from './store/store';

// Ensure Prism is available globally for any code that might access it
if (typeof window !== 'undefined') {
  (window as any).Prism = Prism;
}


const sampleCollectionYaml = `
opencollection: "1.0.0"
info:
  name: "Bruno Testbench"
  summary: "A comprehensive API collection for testing OpenCollection features"
  version: "1.0.0"
config:
  environments:
    - name: "Local"
      variables:
        - name: "host"
          value: "http://localhost:8081"
        - name: "bearer_auth_token"
          value: "your_secret_token"
    - name: "Prod"
      variables:
        - name: "host"
          value: "https://echo.usebruno.com"
        - name: "bearer_auth_token"
          value: "your_secret_token"
request:
  headers:
    - name: "collection-header"
      value: "collection-header-value"
  variables:
    - name: "collection_pre_var"
      value: "collection_pre_var_value"
    - name: "collection-var"
      value: "collection-var-value"
  auth:
    type: "bearer"
    token: "{{bearer_auth_token}}"
docs:
  content: |
    # Bruno Testbench

    This is a comprehensive API collection for testing OpenCollection features.

    ## Getting Started

    1. Select an environment (Local or Prod)
    2. Try out the various API endpoints
    3. Check the response examples

    ## Authentication

    Most endpoints require authentication. Use the bearer token provided in the environment variables.
  type: "text/markdown"

items:
  - name: "echo json"
    type: "http"
    seq: 2
    method: "POST"
    url: "{{host}}/api/echo/json"
    headers:
      - name: "Content-Type"
        value: "application/json"
    variables:
      - name: "request-level-variable"
        value: "request-level-variable-value"
    body:
      type: "json"
      data: |
        {
          "test": "{{request-level-variable}}",
        }
    assertions:
      - expression: "res.status"
        operator: "eq"
        value: "200"
      - expression: "res.body.title"
        operator: "isString"
      - expression: "res.headers['content-type']"
        operator: "contains"
        value: "application/json"
    scripts:
      tests: |
        test("Status should be 200 or 201", function() {
          expect(res.getStatus()).to.be.oneOf([200, 201]);
          expect(res.getBody().test).to.be.a("string");
        });
    examples:
      - name: "Create User"
        request:
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "Authorization"
              value: "Bearer token123"
            - name: "X-Request-ID"
              value: "abc-123-def"
          body:
            type: "json"
            data: |
              {
                "name": "John Doe",
                "email": "john@example.com"
              }
        response:
          status: 201
          statusText: "Created"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com"
              }
      - name: "Update User"
        request:
          body:
            type: "json"
            data: |
              {
                "name": "Jane Doe",
                "email": "jane@example.com"
              }
        response:
          status: 200
          statusText: "OK"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "id": 1,
                "name": "Jane Doe",
                "email": "jane@example.com"
              }
      - name: "Empty Response"
        response:
          status: 200
          statusText: "OK"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {}
      - name: "Validation Error"
        response:
          status: 400
          statusText: "Bad Request"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "error": "Invalid request body",
                "code": "VALIDATION_ERROR"
              }

  - name: "auth"
    type: "folder"
    seq: 3
    request:
      headers:
        - name: "folder-level-header"
          value: "folder-level-header-value"
      variables:
        - name: "folder-level-variable"
          value: "folder-level-variable-value"
      scripts:
        preRequest: |
          console.log("Folder pre request script");
        postResponse: |
          console.log("Folder post response script");
    items:
      - name: "Bearer Auth 200"
        type: "http"
        seq: 1
        method: "GET"
        url: "{{host}}/api/auth/bearer/protected"
        auth:
          type: "bearer"
          token: "{{bearer_auth_token}}"
        assertions:
          - expression: "res.status"
            operator: "eq"
            value: "200"
          - expression: "res.body.message"
            operator: "eq"
            value: "Authentication successful"

      - name: "Basic Auth 200"
        type: "http"
        seq: 2
        method: "GET"
        url: "{{host}}/api/auth/basic/protected"
        auth:
          type: "basic"
          username: "admin"
          password: "{{basic_auth_password}}"
        assertions:
          - expression: "res.status"
            operator: "eq"
            value: "200"
        docs: "Basic authentication test"
`;

// Development App component
const DevApp: React.FC = () => {
  const store = createOpenCollectionStore();

  return (
    <Provider store={store}>
      <div style={{ height: '100vh', width: '100vw' }}>
        <OpenCollection
          collection={sampleCollectionYaml}
          logo="/src/assets/opencollection-logo.svg"
        />
      </div>
    </Provider>
  );
};

// Render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DevApp />);
} else {
  console.error('Root container not found');
}
