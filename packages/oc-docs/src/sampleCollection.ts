export const sampleCollectionYaml = `
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
  scripts:
    - type: before-request
      code: |-
        // used by \`scripting/js/folder-collection script-tests\`
        const shouldTestCollectionScripts = bru.getVar('should-test-collection-scripts');
        if(shouldTestCollectionScripts) {
         bru.setVar('collection-var-set-by-collection-script', 'collection-var-value-set-by-collection-script');
        }
    - type: after-response
      code: wefewfewfewfewfwefwefewfewfewfewfewfewfewfewf
    - type: tests
      code: |-
        // used by \`scripting/js/folder-collection script-tests\`
        const shouldTestCollectionScripts = bru.getVar('should-test-collection-scripts');
        const collectionVar = bru.getVar("collection-var-set-by-collection-script");
        if (shouldTestCollectionScripts && collectionVar) {
          test("collection level test - should get the var that was set by the collection script", function() {
            expect(collectionVar).to.equal("collection-var-value-set-by-collection-script");
          });
          bru.setVar('collection-var-set-by-collection-script', null);
          bru.setVar('should-test-collection-scripts', null);
        }
docs:
  content: |
    This is a comprehensive API collection for testing **OpenCollection** features.

    ## Getting Started

    1. Select an environment (*Local* or *Prod*)
    2. Try out the various API endpoints
    3. Check the response examples

    ## Authentication

    Most endpoints require authentication. Use the bearer token provided in the environment variables.

    | Environment | Base URL | Auth |
    |-------------|----------|------|
    | Local | \`http://localhost:8081\` | Bearer token |
    | Prod | \`https://echo.usebruno.com\` | Bearer token |

    ## Rate Limits

    All endpoints enforce the following rate limits:

    - **Free tier**: 100 requests/minute
    - **Pro tier**: 1000 requests/minute

    Example request with auth header:

    \`\`\`bash
    curl -H "Authorization: Bearer your_secret_token" http://localhost:8081/api/echo/json
    \`\`\`

    > **Note**: All responses include \`X-RateLimit-Remaining\` and \`X-Request-ID\` headers.
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
            - name: "X-Request-ID"
              value: "abc-123-def"
            - name: "X-RateLimit-Remaining"
              value: "99"
            - name: "Location"
              value: "/api/users/1"
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
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "Authorization"
              value: "Bearer token123"
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
            - name: "X-Request-ID"
              value: "def-456-ghi"
            - name: "X-RateLimit-Remaining"
              value: "98"
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
        request:
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "name": "",
                "email": "not-an-email"
              }
        response:
          status: 400
          statusText: "Bad Request"
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "X-Request-ID"
              value: "err-789-jkl"
          body:
            type: "json"
            data: |
              {
                "error": "Invalid request body",
                "code": "VALIDATION_ERROR",
                "details": [
                  {"field": "name", "message": "Name is required"},
                  {"field": "email", "message": "Invalid email format"}
                ]
              }
      - name: "Server Error"
        response:
          status: 500
          statusText: "Internal Server Error"
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "Retry-After"
              value: "30"
          body:
            type: "json"
            data: |
              {
                "error": "Unexpected server error",
                "code": "INTERNAL_ERROR",
                "traceId": "trace-abc-123"
              }

  - name: "get users"
    type: "http"
    seq: 1
    method: "GET"
    url: "{{host}}/api/users?page=1&limit=10"
    headers:
      - name: "Accept"
        value: "application/json"
    docs: "Retrieve a paginated list of users. Supports filtering by role and status query parameters."
    examples:
      - name: "List Users"
        request:
          headers:
            - name: "Accept"
              value: "application/json"
            - name: "Authorization"
              value: "Bearer token123"
        response:
          status: 200
          statusText: "OK"
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "X-Total-Count"
              value: "42"
            - name: "X-Page"
              value: "1"
            - name: "X-Per-Page"
              value: "10"
            - name: "Link"
              value: '</api/users?page=2&limit=10>; rel="next"'
          body:
            type: "json"
            data: |
              {
                "data": [
                  {"id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin"},
                  {"id": 2, "name": "Bob", "email": "bob@example.com", "role": "user"}
                ],
                "pagination": {
                  "page": 1,
                  "limit": 10,
                  "total": 42
                }
              }
      - name: "Unauthorized"
        response:
          status: 401
          statusText: "Unauthorized"
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "WWW-Authenticate"
              value: 'Bearer realm="api"'
          body:
            type: "json"
            data: |
              {
                "error": "Authentication required",
                "code": "UNAUTHORIZED"
              }

  - name: "update user"
    type: "http"
    seq: 4
    method: "PUT"
    url: "{{host}}/api/users/1"
    headers:
      - name: "Content-Type"
        value: "application/json"
      - name: "Authorization"
        value: "Bearer {{bearer_auth_token}}"
      - name: "X-Deprecated-Header"
        value: "old-value"
        disabled: true
    body:
      type: "json"
      data: |
        {
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "admin"
        }
    docs: "Replace an existing user entirely. All fields are required."
    examples:
      - name: "Success"
        request:
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "Authorization"
              value: "Bearer token123"
          body:
            type: "json"
            data: |
              {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "role": "admin"
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
                "email": "jane@example.com",
                "role": "admin"
              }
      - name: "Not Found"
        response:
          status: 404
          statusText: "Not Found"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "error": "User not found",
                "code": "NOT_FOUND"
              }

  - name: "patch user"
    type: "http"
    seq: 5
    method: "PATCH"
    url: "{{host}}/api/users/1"
    headers:
      - name: "Content-Type"
        value: "application/json"
    body:
      type: "json"
      data: |
        {
          "role": "moderator"
        }
    docs: "Partially update a user. Only provided fields are modified."
    examples:
      - name: "Update Role"
        request:
          body:
            type: "json"
            data: |
              {
                "role": "moderator"
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
                "email": "jane@example.com",
                "role": "moderator"
              }

  - name: "delete user"
    type: "http"
    seq: 6
    method: "DELETE"
    url: "{{host}}/api/users/1"
    headers:
      - name: "Authorization"
        value: "Bearer {{bearer_auth_token}}"
    docs: "Permanently delete a user by ID. This action cannot be undone."
    examples:
      - name: "Deleted"
        response:
          status: 204
          statusText: "No Content"
      - name: "Forbidden"
        response:
          status: 403
          statusText: "Forbidden"
          headers:
            - name: "Content-Type"
              value: "application/json"
          body:
            type: "json"
            data: |
              {
                "error": "Insufficient permissions",
                "code": "FORBIDDEN"
              }

  - name: "submit form"
    type: "http"
    seq: 7
    method: "POST"
    url: "{{host}}/api/contact"
    headers:
      - name: "Content-Type"
        value: "application/x-www-form-urlencoded"
    body:
      type: "form-urlencoded"
      data:
        - name: "name"
          value: "Alice"
        - name: "email"
          value: "alice@example.com"
        - name: "message"
          value: "Hello from the form"
        - name: "debug"
          value: "true"
          disabled: true
    docs: "Submit a contact form using URL-encoded form data."
    examples:
      - name: "Submitted"
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
                "success": true,
                "message": "Form submitted"
              }

  - name: "upload file"
    type: "http"
    seq: 8
    method: "POST"
    url: "{{host}}/api/upload"
    headers:
      - name: "Authorization"
        value: "Bearer {{bearer_auth_token}}"
    body:
      type: "multipart-form"
      data:
        - name: "file"
          type: "file"
          value: "/path/to/document.pdf"
        - name: "description"
          type: "text"
          value: "Quarterly report"
        - name: "tags"
          type: "text"
          value: "report,quarterly"
    docs: "Upload a file with metadata using multipart form data."
    examples:
      - name: "Uploaded"
        response:
          status: 201
          statusText: "Created"
          headers:
            - name: "Content-Type"
              value: "application/json"
            - name: "Location"
              value: "/api/files/abc-123"
          body:
            type: "json"
            data: |
              {
                "id": "abc-123",
                "filename": "document.pdf",
                "size": 204800,
                "url": "/api/files/abc-123"
              }

  - name: "xml payload"
    type: "http"
    seq: 9
    method: "POST"
    url: "{{host}}/api/soap/endpoint"
    headers:
      - name: "Content-Type"
        value: "text/xml"
      - name: "SOAPAction"
        value: "GetUserInfo"
    body:
      type: "xml"
      data: |
        <?xml version="1.0" encoding="UTF-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <GetUserInfo>
              <UserId>42</UserId>
            </GetUserInfo>
          </soap:Body>
        </soap:Envelope>
    docs: "SOAP endpoint that accepts XML payloads."
    examples:
      - name: "User Info"
        request:
          headers:
            - name: "Content-Type"
              value: "text/xml"
            - name: "SOAPAction"
              value: "GetUserInfo"
          body:
            type: "xml"
            data: |
              <?xml version="1.0" encoding="UTF-8"?>
              <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <GetUserInfo>
                    <UserId>42</UserId>
                  </GetUserInfo>
                </soap:Body>
              </soap:Envelope>
        response:
          status: 200
          statusText: "OK"
          headers:
            - name: "Content-Type"
              value: "text/xml"
          body:
            type: "xml"
            data: |
              <?xml version="1.0" encoding="UTF-8"?>
              <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <GetUserInfoResponse>
                    <Name>Alice</Name>
                    <Email>alice@example.com</Email>
                  </GetUserInfoResponse>
                </soap:Body>
              </soap:Envelope>

  - name: "search users"
    type: "http"
    seq: 10
    method: "GET"
    url: "{{host}}/api/users/search"
    params:
      - name: "q"
        value: "alice"
        type: "query"
      - name: "role"
        value: "admin"
        type: "query"
      - name: "status"
        value: "active"
        type: "query"
      - name: "verbose"
        value: "true"
        type: "query"
        disabled: true
    headers:
      - name: "Accept"
        value: "application/json"
    docs: "Search users by query string, role, and status. Supports pagination via query params."
    examples:
      - name: "Results"
        request:
          params:
            - name: "q"
              value: "alice"
              type: "query"
            - name: "role"
              value: "admin"
              type: "query"
            - name: "status"
              value: "active"
              type: "query"
          headers:
            - name: "Accept"
              value: "application/json"
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
                "results": [
                  {"id": 1, "name": "Alice", "role": "admin", "status": "active"}
                ],
                "total": 1
              }

  - name: "Jokes"
    type: "http"
    seq: 11
    method: "GET"
    url: "https://jsonplaceholder.typicode.com/posts/:postId"
    params:
      - name: "postId"
        value: "1"
        type: "path"
    headers:
      - name: "Accept"
        value: "application/json"
    docs: "Fetch a single post by its ID. The postId is supplied as a path parameter in the URL."
    examples:
      - name: "Single Post"
        request:
          params:
            - name: "postId"
              value: "1"
              type: "path"
          headers:
            - name: "Accept"
              value: "application/json"
        response:
          status: 200
          statusText: "OK"
          headers:
            - name: "Content-Type"
              value: "application/json; charset=utf-8"
          body:
            type: "json"
            data: |
              {
                "userId": 1,
                "id": 1,
                "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum"
              }
      - name: "Not Found"
        response:
          status: 404
          statusText: "Not Found"
          headers:
            - name: "Content-Type"
              value: "application/json; charset=utf-8"
          body:
            type: "json"
            data: |
              {}

`;
