export const sampleCollectionYaml = `
opencollection: 1.0.0
info:
  name: bruno-testbench
config:
  proxy:
    inherit: true
    config:
      protocol: http
      hostname: '{{proxyHostname}}'
      port: 4000
      auth:
        username: anoop
        password: password
        disabled: true
      bypassProxy: ''
  environments:
    - name: Local
      variables:
        - name: host
          value: http://localhost:8080
        - name: localhost
          value: http://localhost:8081
        - name: httpfaker
          value: https://www.httpfaker.org
        - name: bearer_auth_token
          value: your_secret_token
        - name: basic_auth_password
          value: della
        - name: env.var1
          value: envVar1
        - name: env-var2
          value: envVar2
        - name: bark
          value: '{{process.env.PROC_ENV_VAR}}'
        - name: foo
          value: bar
        - name: testSetEnvVar
          value: bruno-29653
        - name: echo-host
          value: https://echo.usebruno.com
        - name: client_id
          value: client_id_1
        - name: client_secret
          value: client_secret_1
        - name: auth_url
          value: http://localhost:8080/api/auth/oauth2/authorization_code/authorize
        - name: callback_url
          value: http://localhost:8080/api/auth/oauth2/authorization_code/callback
        - name: access_token_url
          value: http://localhost:8080/api/auth/oauth2/authorization_code/token
        - name: passwordCredentials_username
          value: foo
        - name: passwordCredentials_password
          value: bar
        - name: github_authorize_url
          value: https://github.com/login/oauth/authorize
        - name: github_access_token_url
          value: https://github.com/login/oauth/access_token
        - name: google_auth_url
          value: https://accounts.google.com/o/oauth2/auth
        - name: google_access_token_url
          value: https://accounts.google.com/o/oauth2/token
        - name: google_scope
          value: https://www.googleapis.com/auth/userinfo.email
        - name: github_client_secret
          secret: true
        - name: github_client_id
          secret: true
        - name: google_client_id
          secret: true
        - name: google_client_secret
          secret: true
        - name: github_authorization_code
          secret: true
        - name: passwordCredentials_access_token
          secret: true
        - name: client_credentials_access_token
          secret: true
        - name: authorization_code_access_token
          secret: true
        - name: github_access_token
          secret: true
    - name: Prod
      variables:
        - name: host
          value: https://testbench-sanity.usebruno.com
        - name: localhost
          value: http://localhost:8081
        - name: httpfaker
          value: https://www.httpfaker.org
        - name: bearer_auth_token
          value: your_secret_token
        - name: basic_auth_password
          value: della
        - name: env.var1
          value: envVar1
        - name: env-var2
          value: envVar2
        - name: bark
          value: '{{process.env.PROC_ENV_VAR}}'
        - name: foo
          value: bar
        - name: testSetEnvVar
          value: bruno-29653
        - name: echo-host
          value: https://echo.usebruno.com
items:
  - info:
      name: GraphQL
      type: graphql
      seq: 17
    graphql:
      url: http://localhost:6000
      method: GET
      auth: inherit
    settings:
      encodeUrl: true
      timeout: 0
      followRedirects: true
      maxRedirects: 5
  - info:
      name: asserts
      type: folder
    items:
      - info:
          name: test-assert-combinations
          type: http
          seq: 1
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "type": "application/json",
                "contentJSON": {
                  "string": "foo",
                  "stringWithSQuotes": "'foo'",
                  "stringWithDQuotes": "\\"foo\\"",
                  "number": 123,
                  "numberAsString": "123",
                  "numberAsStringWithSQuotes": "'123'",
                  "numberAsStringWithDQuotes": "\\"123\\"",
                  "numberAsStringWithLeadingZero": "0123",
                  "numberBig": 9007199254740992000,
                  "numberBigAsString": "9007199254740991999",
                  "null": null,
                  "nullAsString": "null",
                  "nullAsStringWithSQuotes": "'null'",
                  "nullAsStringWithDQuotes": "\\"null\\"",
                  "true": true,
                  "trueAsString": "true",
                  "trueAsStringWithSQuotes": "'true'",
                  "trueAsStringWithDQuotes": "\\"true\\"",
                  "false": false,
                  "falseAsString": "false",
                  "falseAsStringWithSQuotes": "'false'",
                  "falseAsStringWithDQuotes": "\\"false\\"",
                  "stringWithCurlyBraces": "{foo}",
                  "stringWithDoubleCurlyBraces": "{{foobar}}"
                }
              }
        runtime:
          assertions:
            - expression: res.body.string
              operator: eq
              value: foo
            - expression: res.body.string
              operator: eq
              value: '''foo'''
            - expression: res.body.string
              operator: eq
              value: '"foo"'
            - expression: res.body.stringWithSQuotes
              operator: eq
              value: '"''foo''"'
            - expression: res.body.stringWithDQuotes
              operator: eq
              value: '''"foo"'''
            - expression: res.body.number
              operator: eq
              value: '123'
            - expression: res.body.numberAsString
              operator: eq
              value: '''123'''
            - expression: res.body.numberAsString
              operator: eq
              value: '"123"'
            - expression: res.body.numberAsStringWithSQuotes
              operator: eq
              value: '"''123''"'
            - expression: res.body.numberAsStringWithDQuotes
              operator: eq
              value: '''"123"'''
            - expression: res.body.numberAsStringWithLeadingZero
              operator: eq
              value: '"0123"'
            - expression: res.body.numberBig.toString()
              operator: eq
              value: '''9007199254740992000'''
            - expression: res.body.numberBigAsString
              operator: eq
              value: '"9007199254740991999"'
            - expression: res.body.null
              operator: eq
              value: 'null'
            - expression: res.body.nullAsString
              operator: eq
              value: '"null"'
            - expression: res.body.nullAsStringWithSQuotes
              operator: eq
              value: '"''null''"'
            - expression: res.body.nullAsStringWithDQuotes
              operator: eq
              value: '''"null"'''
            - expression: res.body.true
              operator: eq
              value: 'true'
            - expression: res.body.trueAsString
              operator: eq
              value: '"true"'
            - expression: res.body.trueAsStringWithSQuotes
              operator: eq
              value: '"''true''"'
            - expression: res.body.trueAsStringWithDQuotes
              operator: eq
              value: '''"true"'''
            - expression: res.body.false
              operator: eq
              value: 'false'
            - expression: res.body.falseAsString
              operator: eq
              value: '"false"'
            - expression: res.body.falseAsStringWithSQuotes
              operator: eq
              value: '"''false''"'
            - expression: res.body.falseAsStringWithDQuotes
              operator: eq
              value: '''"false"'''
            - expression: res.body.nonexistent
              operator: eq
              value: undefined
            - expression: res.body.stringWithCurlyBraces
              operator: eq
              value: '"{foo}"'
            - expression: res.body.stringWithDoubleCurlyBraces
              operator: eq
              value: '"{{foobar}}"'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
        examples:
          - name: example
            request:
              url: '{{httpfaker}}/api/echo/custom'
              method: POST
              body:
                type: json
                data: |-
                  {
                    "type": "application/json",
                    "contentJSON": {
                      "string": "foo",
                      "stringWithSQuotes": "'foo'",
                      "stringWithDQuotes": "\\"foo\\"",
                      "number": 123,
                      "numberAsString": "123",
                      "numberAsStringWithSQuotes": "'123'",
                      "numberAsStringWithDQuotes": "\\"123\\"",
                      "numberAsStringWithLeadingZero": "0123",
                      "numberBig": 9007199254740992000,
                      "numberBigAsString": "9007199254740991999",
                      "null": null,
                      "nullAsString": "null",
                      "nullAsStringWithSQuotes": "'null'",
                      "nullAsStringWithDQuotes": "\\"null\\"",
                      "true": true,
                      "trueAsString": "true",
                      "trueAsStringWithSQuotes": "'true'",
                      "trueAsStringWithDQuotes": "\\"true\\"",
                      "false": false,
                      "falseAsString": "false",
                      "falseAsStringWithSQuotes": "'false'",
                      "falseAsStringWithDQuotes": "\\"false\\"",
                      "stringWithCurlyBraces": "{foo}",
                      "stringWithDoubleCurlyBraces": "{{foobar}}"
                    }
                  }
            response:
              status: 200
              statusText: OK
              headers:
                - name: server
                  value: nginx/1.30.1
                - name: date
                  value: Thu, 18 Jun 2026 07:02:18 GMT
                - name: content-type
                  value: application/json
                - name: transfer-encoding
                  value: chunked
                - name: connection
                  value: keep-alive
                - name: strict-transport-security
                  value: max-age=63072000; includeSubdomains
                - name: x-frame-options
                  value: DENY
                - name: x-content-type-options
                  value: nosniff
              body:
                type: json
                data: |-
                  {
                    "string": "foo",
                    "stringWithSQuotes": "'foo'",
                    "stringWithDQuotes": "\\"foo\\"",
                    "number": 123,
                    "numberAsString": "123",
                    "numberAsStringWithSQuotes": "'123'",
                    "numberAsStringWithDQuotes": "\\"123\\"",
                    "numberAsStringWithLeadingZero": "0123",
                    "numberBig": 9007199254740992000,
                    "numberBigAsString": "9007199254740991999",
                    "null": null,
                    "nullAsString": "null",
                    "nullAsStringWithSQuotes": "'null'",
                    "nullAsStringWithDQuotes": "\\"null\\"",
                    "true": true,
                    "trueAsString": "true",
                    "trueAsStringWithSQuotes": "'true'",
                    "trueAsStringWithDQuotes": "\\"true\\"",
                    "false": false,
                    "falseAsString": "false",
                    "falseAsStringWithSQuotes": "'false'",
                    "falseAsStringWithDQuotes": "\\"false\\"",
                    "stringWithCurlyBraces": "{foo}",
                    "stringWithDoubleCurlyBraces": "{{foobar}}"
                  }
  - info:
      name: auth
      type: folder
    items:
      - info:
          name: basic
          type: folder
        items:
          - info:
              name: via auth
              type: folder
            items:
              - info:
                  name: Basic Auth 200
                  type: http
                  seq: 1
                http:
                  method: POST
                  url: '{{host}}/api/auth/basic/protected'
                  body:
                    type: json
                    data: ''
                  auth:
                    type: basic
                    username: bruno
                    password: '{{basic_auth_password}}'
                runtime:
                  assertions:
                    - expression: res.status
                      operator: '200'
                      value: ''
                    - expression: res.body.message
                      operator: Authentication
                      value: successful
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: Basic Auth 400
                  type: http
                  seq: 2
                http:
                  method: POST
                  url: '{{host}}/api/auth/basic/protected'
                  body:
                    type: json
                    data: ''
                runtime:
                  assertions:
                    - expression: res.status
                      operator: '401'
                      value: ''
                    - expression: res.body
                      operator: Unauthorized
                      value: ''
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: via script
              type: folder
            items:
              - info:
                  name: Basic Auth 200
                  type: http
                  seq: 1
                http:
                  method: POST
                  url: '{{host}}/api/auth/basic/protected'
                  body:
                    type: json
                    data: ''
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const username = "bruno";
                        const password = "della";

                        const authString = \`\${username}:\${password}\`;
                        const encodedAuthString = require('btoa')(authString);

                        req.setHeader("Authorization", \`Basic \${encodedAuthString}\`);
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body.message
                      operator: Authentication
                      value: successful
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: Basic Auth 401
                  type: http
                  seq: 2
                http:
                  method: POST
                  url: '{{host}}/api/auth/basic/protected'
                  body:
                    type: json
                    data: ''
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const username = "bruno";
                        const password = "invalid";

                        const authString = \`\${username}:\${password}\`;
                        const encodedAuthString = require('btoa')(authString);

                        req.setHeader("Authorization", \`Basic \${encodedAuthString}\`);
                  assertions:
                    - expression: res.status
                      operator: '401'
                      value: ''
                    - expression: res.body
                      operator: Unauthorized
                      value: ''
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
      - info:
          name: bearer
          type: folder
        items:
          - info:
              name: via auth
              type: folder
            items:
              - info:
                  name: Bearer Auth 200
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/api/auth/bearer/protected'
                  auth:
                    type: bearer
                    token: '{{bearer_auth_token}}'
                runtime:
                  scripts:
                    - type: after-response
                      code: bru.setEnvVar("foo", "bar");
                  assertions:
                    - expression: res.status
                      operator: '200'
                      value: ''
                    - expression: res.body.message
                      operator: Authentication
                      value: successful
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: Bearer Auth undefined
                  type: http
                  seq: 2
                http:
                  method: GET
                  url: '{{host}}/api/auth/bearer/protected'
                  headers:
                    - name: Authorization
                      value: Bearer {{bearer_auth_token}}
                  auth:
                    type: bearer
                    token: ''
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("selected auth overrides Authorization header always", function() {
                          const authHeader =  req.getHeader("Authorization")
                          expect(authHeader).to.eql("Bearer ")
                        })
                  assertions:
                    - expression: res.body.message
                      operator: eq
                      value: Unauthorized
                    - expression: res.status
                      operator: eq
                      value: '401'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: via headers
              type: folder
            items:
              - info:
                  name: Bearer Auth 200
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/api/auth/bearer/protected'
                  headers:
                    - name: Authorization
                      value: Bearer {{bearer_auth_token}}
                  body:
                    type: json
                    data: ''
                runtime:
                  variables:
                    - name: a-c
                      value: foo
                  scripts:
                    - type: after-response
                      code: bru.setEnvVar("foo", "bar");
                  assertions:
                    - expression: res.status
                      operator: '200'
                      value: ''
                    - expression: res.body.message
                      operator: Authentication
                      value: successful
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
                examples:
                  - name: example-10
                    request:
                      url: '{{host}}/api/auth/bearer/protected'
                      method: GET
                      headers:
                        - name: Authorization
                          value: Bearer {{bearer_auth_token}}
                      body:
                        type: json
                        data: ''
                    response:
                      status: 200
                      statusText: OK
                      body:
                        type: text
                        data: ''
      - info:
          name: cookie
          type: folder
        items:
          - info:
              name: Check
              type: http
              seq: 2
            http:
              method: GET
              url: '{{host}}/api/auth/cookie/protected'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: Login
              type: http
              seq: 1
            http:
              method: POST
              url: '{{host}}/api/auth/cookie/login'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: digest
          type: folder
        items:
          - info:
              name: Digest Auth 200
              type: http
              seq: 1
            http:
              method: GET
              url: https://www.httpfaker.org/api/auth/digest/auth/admin/password
              auth:
                type: digest
                username: admin
                password: password
            runtime:
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body.authenticated
                  operator: isTruthy
                  value: ''
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: Digest Auth 401
              type: http
              seq: 2
            http:
              method: GET
              url: https://www.httpfaker.org/api/auth/digest/auth/admin/badpassword
              auth:
                type: digest
                username: foo
                password: passwd
            runtime:
              assertions:
                - expression: res.status
                  operator: eq
                  value: '401'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: inherit auth
          type: folder
        items:
          - info:
              name: inherit Bearer Auth 200
              type: http
              seq: 2
            http:
              method: GET
              url: '{{host}}/api/auth/bearer/protected'
              auth: inherit
            runtime:
              scripts:
                - type: after-response
                  code: bru.setEnvVar("foo", "bar");
              assertions:
                - expression: res.status
                  operator: '200'
                  value: ''
                - expression: res.body.message
                  operator: Authentication
                  value: successful
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
  - info:
      name: echo
      type: folder
    items:
      - info:
          name: echo bom json
          type: http
          seq: 1
        http:
          method: GET
          url: '{{host}}/api/echo/bom-json-test'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo default request headers
          type: http
          seq: 14
        http:
          method: POST
          url: '{{echo-host}}'
        runtime:
          scripts:
            - type: tests
              code: |-
                test("sends Accept header with application/json by default", function() {
                  // The echo server reflects request headers back as response headers.
                  // Verifies that axios's default Accept header is not clobbered when
                  // setting User-Agent (regression for: defaults.headers.common object replacement).
                  const accept = res.getHeaders()["accept"];
                  expect(accept).to.be.a("string");
                  expect(accept).to.include("application/json");
                });

                test("sends User-Agent header with bruno-runtime prefix", function() {
                  const userAgent = res.getHeaders()["user-agent"];
                  expect(userAgent).to.be.a("string");
                  expect(userAgent).to.match(/^bruno-runtime\\//);
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo form-url-encoded
          type: http
          seq: 9
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: form-urlencoded
            data:
              - name: form-data-key
                value: '{{form-data-key}}'
              - name: form-data-stringified-object
                value: '{{form-data-stringified-object}}'
              - name: key_1
                value: value_1
              - name: key_2
                value: value_2
              - name: key_1
                value: value_3
              - name: key_2
                value: value_4
        runtime:
          scripts:
            - type: before-request
              code: |-
                let obj = JSON.stringify({foo:123});
                bru.setVar('form-data-key', 'form-data-value');
                bru.setVar('form-data-stringified-object', obj);
            - type: tests
              code: |-
                test("form-urlencoded body with variables and duplicate keys", function() {
                  const expected = [
                    "form-data-key=form-data-value",
                    "form-data-stringified-object=%7B%22foo%22%3A123%7D", // {"foo":123} URL encoded
                    "key_1=value_1",
                    "key_2=value_2", 
                    "key_1=value_3", // duplicate key with different value
                    "key_2=value_4"  // duplicate key with different value
                  ].join("&");
                  
                  expect(res.getBody()).to.eql(expected);
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo headers
          type: http
          seq: 13
        http:
          method: POST
          url: '{{echo-host}}'
          headers:
            - name: Custom-Header-String
              value: bruno
          auth: inherit
        runtime:
          scripts:
            - type: tests
              code: |-
                test("test headers",function() {
                  expect(res.getHeaders()).to.have.property("Custom-Header-String".toLowerCase())
                  expect(res.getHeaders()).to.have.property("Custom-Header-String".toLowerCase(), "bruno")
                })
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo json
          type: http
          seq: 2
        http:
          method: POST
          url: '{{host}}/api/echo/json'
          headers:
            - name: foo
              value: bar
          body:
            type: json
            data: |-
              {
                "hello": "bruno"
              }
        runtime:
          scripts:
            - type: before-request
              code: bru.setVar("foo", "foo-world-2");
            - type: tests
              code: |-
                test("should return json", function() {
                  const data = res.getBody();
                  expect(res.getBody()).to.eql({
                    "hello": "bruno"
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo multipart via scripting
          type: http
          seq: 10
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: multipart-form
            data: []
        runtime:
          scripts:
            - type: before-request
              code: |-
                const FormData = require("form-data");
                const form = new FormData();
                form.append('form-data-key', 'form-data-value');
                req.setBody(form);
          assertions:
            - expression: res.body
              operator: contains
              value: form-data-value
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo multipart
          type: http
          seq: 8
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: multipart-form
            data:
              - name: foo
                type: text
                value: '{"bar":"baz"}'
              - name: multiline
                type: text
                value: '"multiline-test"'
              - name: form-data-key
                type: text
                value: '{{form-data-key}}'
              - name: form-data-stringified-object
                type: text
                value: '{{form-data-stringified-object}}'
              - name: file
                type: file
                value:
                  - bruno.png
        runtime:
          scripts:
            - type: before-request
              code: |-
                let obj = JSON.stringify({foo:123});
                bru.setVar('form-data-key', 'form-data-value');
                bru.setVar('form-data-stringified-object', obj);
          assertions:
            - expression: res.body
              operator: contains
              value: form-data-value
            - expression: res.body
              operator: contains
              value: '{"foo":123}'
            - expression: res.body
              operator: contains
              value: 'Content-Type: application/json--test'
            - expression: res.body
              operator: contains
              value: 'Content-Type: application/json--multiline--test'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo numbers
          type: http
          seq: 1
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: json
            data: |-
              {
                "integer": 123,
                "negativeInteger": -99,
                "zero": 0,
                "float": 2.718,
                "negativeFloat": -1.618,
                "largeDouble": 12345.678901234567,
                "smallDouble": 9.876e-12,
                "booleanTrue": true,
                "booleanFalse": false
              }
        runtime:
          assertions:
            - expression: res.body.integer
              operator: eq
              value: '123'
            - expression: res.body.integer
              operator: isNumber
              value: ''
            - expression: res.body.negativeInteger
              operator: eq
              value: '-99'
            - expression: res.body.negativeInteger
              operator: isNumber
              value: ''
            - expression: res.body.zero
              operator: eq
              value: '0'
            - expression: res.body.zero
              operator: isNumber
              value: ''
            - expression: res.body.float
              operator: eq
              value: '2.718'
            - expression: res.body.float
              operator: isNumber
              value: ''
            - expression: res.body.negativeFloat
              operator: eq
              value: '-1.618'
            - expression: res.body.negativeFloat
              operator: isNumber
              value: ''
            - expression: res.body.largeDouble
              operator: eq
              value: '12345.678901234567'
            - expression: res.body.largeDouble
              operator: isNumber
              value: ''
            - expression: res.body.smallDouble
              operator: eq
              value: '9.876e-12'
            - expression: res.body.smallDouble
              operator: isNumber
              value: ''
            - expression: res.body.booleanTrue
              operator: eq
              value: 'true'
            - expression: res.body.booleanFalse
              operator: eq
              value: 'false'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
        examples:
          - name: example
            description: test
            request:
              url: '{{echo-host}}'
              method: POST
              body:
                type: json
                data: |-
                  {
                    "integer": 123,
                    "negativeInteger": -99,
                    "zero": 0,
                    "float": 2.718,
                    "negativeFloat": -1.618,
                    "largeDouble": 12345.678901234567,
                    "smallDouble": 9.876e-12,
                    "booleanTrue": true,
                    "booleanFalse": false
                  }
            response:
              status: 200
              statusText: OK
              body:
                type: text
                data: ''
      - info:
          name: echo plaintext
          type: http
          seq: 3
        http:
          method: POST
          url: '{{host}}/api/echo/text'
          body:
            type: text
            data: hello
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return plain text", function() {
                  const data = res.getBody();
                  expect(res.getBody()).to.eql("hello");
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo xml parsed(self closing tags)
          type: http
          seq: 6
        http:
          method: POST
          url: '{{host}}/api/echo/xml-parsed'
          body:
            type: xml
            data: |-
              <hello>
                <world>bruno</world>
                <world/>
              </hello>
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return parsed xml", function() {
                  const data = res.getBody();
                  expect(res.getBody()).to.eql({
                    "hello": {
                      "world": [
                        "bruno",
                        ""
                      ]
                    }
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo xml parsed
          type: http
          seq: 4
        http:
          method: POST
          url: '{{host}}/api/echo/xml-parsed'
          body:
            type: xml
            data: |-
              <hello>
                <world>bruno</world>
              </hello>
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return parsed xml", function() {
                  const data = res.getBody();
                  expect(res.getBody()).to.eql({
                    "hello": {
                      "world": ["bruno"]
                    }
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: echo xml raw
          type: http
          seq: 5
        http:
          method: POST
          url: '{{host}}/api/echo/xml-raw'
          body:
            type: xml
            data: <hello><world>bruno</world></hello>
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: multiline
          type: folder
        items:
          - info:
              name: echo binary
              type: http
              seq: 1
            http:
              method: POST
              url: '{{echo-host}}'
              body:
                type: file
                data:
                  - filePath: bruno.png
                    contentType: image/png
                    selected: true
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: test echo any
          type: http
          seq: 11
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain" },
                "content": "hello"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: hello
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test echo-any json
          type: http
          seq: 12
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "type": "application/json",
                "contentJSON": {"x": 42}
              }
        runtime:
          assertions:
            - expression: res.body.x
              operator: eq
              value: '42'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: file-binary
      type: folder
    items:
      - info:
          name: binary upload json
          type: http
          seq: 1
        http:
          method: POST
          url: '{{localhost}}/api/file-binary/binary-upload-json'
          body:
            type: file
            data:
              - filePath: file.json
                contentType: application/json
                selected: true
        runtime:
          scripts:
            - type: tests
              code: |-
                test("file body is uploaded byte-exact, not as a serialized stream envelope", function() {
                  const body = res.getBody();
                  expect(body.bytesReceived).to.equal(23);
                  expect(body.sha256).to.equal("3f5d648773fc4a79418378d0e75768005a8ef0fbee232a7638d643b716c14175");
                  expect(body.looksLikeSerializedNodeStream).to.equal(false);
                  expect(body.firstBytesUtf8).to.contain('"hello": "bruno"');
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
            - expression: res.body.bytesReceived
              operator: eq
              value: '23'
            - expression: res.body.sha256
              operator: eq
              value: 3f5d648773fc4a79418378d0e75768005a8ef0fbee232a7638d643b716c14175
            - expression: res.body.contentType
              operator: eq
              value: application/json
            - expression: res.body.looksLikeSerializedNodeStream
              operator: eq
              value: 'false'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: binary upload octet-stream
          type: http
          seq: 2
        http:
          method: POST
          url: '{{localhost}}/api/file-binary/binary-upload-octet-stream'
          body:
            type: file
            data:
              - filePath: file.txt
                contentType: application/octet-stream
                selected: true
        runtime:
          scripts:
            - type: tests
              code: |-
                test("non-json file body is uploaded byte-exact", function() {
                  const body = res.getBody();
                  expect(body.bytesReceived).to.equal(23);
                  expect(body.sha256).to.equal("ddf1d7c7f9889618e0066558caa2ab5d0a691ce4cb73fcdd6543e0e1d386d61f");
                  expect(body.looksLikeSerializedNodeStream).to.equal(false);
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
            - expression: res.body.bytesReceived
              operator: eq
              value: '23'
            - expression: res.body.sha256
              operator: eq
              value: ddf1d7c7f9889618e0066558caa2ab5d0a691ce4cb73fcdd6543e0e1d386d61f
            - expression: res.body.contentType
              operator: eq
              value: application/octet-stream
            - expression: res.body.looksLikeSerializedNodeStream
              operator: eq
              value: 'false'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: graphql
      type: folder
    items:
      - info:
          name: mutation
          type: graphql
          seq: 3
        graphql:
          url: '{{localhost}}/api/graphql'
          method: POST
          body:
            query: |
              mutation create($id: String!) {
                create(payload: { id: $id }) {
                  success
                }
              }
            variables: |-
              {
                "id":"1"
              }
          auth: inherit
        runtime:
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
            - expression: res.body.data.create.success
              operator: eq
              value: 'true'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: spacex
          type: graphql
          seq: 1
        graphql:
          url: '{{localhost}}/api/graphql'
          method: POST
          body:
            query: |
              {
                company {
                  ceo
                }
              }
            variables: ''
        runtime:
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
            - expression: res.body.data.company.ceo
              operator: eq
              value: Elon Musk
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: variables interpolation
          type: graphql
          seq: 3
        graphql:
          url: '{{host}}/api/echo/json'
          method: POST
          body:
            query: query { __typename }
            variables: |-
              {
                "my_json": "{{my_json}}"
              }
        runtime:
          scripts:
            - type: before-request
              code: |-
                const testData = {
                  a: [1,2,3],
                  b: {
                    c: "test",
                    d: "another value"
                  }
                };

                // Single escaping
                let cv = JSON.stringify(testData).replace(/"/g, '\\\\"');

                bru.setVar("my_json", cv)
            - type: after-response
              code: bru.deleteVar("my_json")
            - type: tests
              code: |-
                test("GraphQL variables with nested object and array are interpolated then sent as parsed object", function() {
                  const body = res.getBody();
                  expect(body).to.have.property("variables");
                  expect(body.variables).to.be.an("object");
                  expect(body.variables).to.have.property("my_json");
                  expect(body.variables.my_json).to.eql("{\\"a\\":[1,2,3],\\"b\\":{\\"c\\":\\"test\\",\\"d\\":\\"another value\\"}}");
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: lib
      type: folder
  - info:
      name: multipart
      type: folder
    items:
      - info:
          name: content-types-mixed-interpolation
          type: http
          seq: 1
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: text
            data: |-
              ------MyCustomBoundaryString
              Content-Disposition: form-data; name="metadata"
              Content-Type: application/json

              {{version}}

              ------MyCustomBoundaryString--
          auth: inherit
        runtime:
          variables:
            - name: version
              value: 0.0.1
          assertions:
            - expression: res.body
              operator: contains
              value: 0.0.1
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: multipart-mixed-form-data-file
          type: http
          seq: 3
        http:
          method: POST
          url: '{{echo-host}}'
          body:
            type: multipart-form
            data:
              - name: sample
                type: file
                value:
                  - bruno.png
        runtime:
          assertions:
            - expression: res.body
              operator: matches
              value: ^[-]+[a-z0-9]+
            - expression: res.body
              operator: contains
              value: 'Content-Type: image/png'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: multipart-mixed-form-data-parse
          type: http
          seq: 1
        http:
          method: POST
          url: '{{echo-host}}'
          headers:
            - name: Content-Type
              value: multipart/mixed
          body:
            type: multipart-form
            data:
              - name: sample
                type: text
                value: sample
        runtime:
          assertions:
            - expression: res.body
              operator: matches
              value: ^[-]+[a-z0-9]+
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: ping
      type: http
      seq: 1
    http:
      method: GET
      url: '{{host}}/ping'
    runtime:
      scripts:
        - type: before-request
          code: bru.runner.stopExecution();
    settings:
      encodeUrl: true
      timeout: 0
      followRedirects: true
      maxRedirects: 5
  - info:
      name: preview
      type: folder
    items:
      - info:
          name: html
          type: folder
        items:
          - info:
              name: bruno
              type: http
              seq: 1
            http:
              method: GET
              url: https://www.usebruno.com
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("should return parsed xml", function() {
                      const headers = res.getHeaders();
                      expect(headers['content-type']).to.eql("text/html; charset=utf-8");
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: image
          type: folder
        items:
          - info:
              name: bruno
              type: http
              seq: 1
            http:
              method: GET
              url: https://www.usebruno.com/favicon.ico
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("should return parsed xml", function() {
                      const headers = res.getHeaders();
                      expect(headers['content-type']).to.eql("image/x-icon");
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
  - info:
      name: redirects
      type: folder
    items:
      - info:
          name: Disable Redirect
          type: http
          seq: 1
        http:
          method: GET
          url: '{{host}}/redirect-to-ping'
        runtime:
          scripts:
            - type: before-request
              code: req.setMaxRedirects(0);
            - type: tests
              code: |-
                test("should disable redirect to ping", function() {
                  const data = res.getBody();
                  expect(data).to.equal('Found. Redirecting to /ping');
                });
          assertions:
            - expression: res.status
              operator: '302'
              value: ''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: Test Multipart Redirect Consumed FormData
          type: http
          seq: 7
        http:
          method: POST
          url: '{{localhost}}/api/redirect/multipart-redirect-source'
          body:
            type: multipart-form
            data:
              - name: consumed-field
                type: text
                value: consumed-value
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should handle consumed FormData recreation during 308 redirect", function() {
                  const data = res.getBody();
                  expect(data).to.be.an('object');
                  expect(data.status).to.equal('success');
                  expect(data.method).to.equal('POST');
                });

                test("should preserve POST method when FormData is consumed and recreated", function() {
                  const data = res.getBody();
                  expect(data.method).to.equal('POST');
                });

                test("should receive form data after FormData recreation", function() {
                  const data = res.getBody();
                  expect(data.body).to.have.property('consumed-field');
                  expect(data.body['consumed-field']).to.equal('consumed-value');
                });

                test("should maintain proper content-type after FormData recreation", function() {
                  const data = res.getBody();
                  expect(data.headers).to.have.property('content-type');
                  expect(data.headers['content-type']).to.include('multipart/form-data');
                });
          assertions:
            - expression: res.status
              operator: '200'
              value: ''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: Test Multipart Redirect Multiple Fields
          type: http
          seq: 5
        http:
          method: POST
          url: '{{localhost}}/api/redirect/multipart-redirect-source'
          body:
            type: multipart-form
            data:
              - name: field1
                type: text
                value: value1
              - name: field2
                type: text
                value: value2
              - name: field3
                type: text
                value: value3
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should successfully redirect complex multipart form data with 308", function() {
                  const data = res.getBody();
                  expect(data).to.be.an('object');
                  expect(data.status).to.equal('success');
                  expect(data.method).to.equal('POST');
                });

                test("should preserve POST method during redirect", function() {
                  const data = res.getBody();
                  expect(data.method).to.equal('POST');
                });

                test("should receive all text fields at target endpoint", function() {
                  const data = res.getBody();
                  expect(data.body).to.have.property('field1');
                  expect(data.body).to.have.property('field2');
                  expect(data.body).to.have.property('field3');
                });

                test("should maintain content-type header during redirect", function() {
                  const data = res.getBody();
                  expect(data.headers).to.have.property('content-type');
                  expect(data.headers['content-type']).to.include('multipart/form-data');
                });
          assertions:
            - expression: res.status
              operator: '200'
              value: ''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: Test Multipart Redirect
          type: http
          seq: 3
        http:
          method: POST
          url: '{{localhost}}/api/redirect/multipart-redirect-source'
          body:
            type: multipart-form
            data:
              - name: test-field
                type: text
                value: test-value
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should successfully redirect multipart form data with 308", function() {
                  const data = res.getBody();
                  expect(data).to.be.an('object');
                  expect(data.status).to.equal('success');
                  expect(data.method).to.equal('POST');
                  expect(data.body).to.be.an('object');
                  expect(data.body['test-field']).to.equal('test-value');
                });

                test("should preserve POST method during redirect", function() {
                  const data = res.getBody();
                  expect(data.method).to.equal('POST');
                });

                test("should receive form data at target endpoint", function() {
                  const data = res.getBody();
                  expect(data.body).to.have.property('test-field');
                  expect(data.body['test-field']).to.equal('test-value');
                });
          assertions:
            - expression: res.status
              operator: '200'
              value: ''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: Test Redirect
          type: http
          seq: 2
        http:
          method: GET
          url: '{{host}}/redirect-to-ping'
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should redirect to ping", function() {
                  const data = res.getBody();
                  expect(data).to.equal('pong');
                });
          assertions:
            - expression: res.status
              operator: '200'
              value: ''
            - expression: res.body
              operator: pong
              value: ''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: request-setting
      type: folder
      seq: 14
    request:
      auth: inherit
    items:
      - info:
          name: follow-redirect
          type: http
          seq: 1
        http:
          method: GET
          url: '{{localhost}}/api/redirect/3'
          auth: inherit
        runtime:
          scripts:
            - type: after-response
              code: |-
                test("body should include redirecting", function() {
                  const data = res.getBody();
                  expect(data).to.include("Redirecting...");
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: false
          maxRedirects: 5
      - info:
          name: max-redirect
          type: http
          seq: 2
        http:
          method: GET
          url: '{{localhost}}/api/redirect/3'
          auth: inherit
        runtime:
          scripts:
            - type: after-response
              code: |-
                test("body should include redirecting", function() {
                  const data = res.status;
                  expect(data).to.be.equal(200)
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: response-parsing
      type: folder
    items:
      - info:
          name: test JSON false response
          type: http
          seq: 11
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "false"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: 'false'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON null response
          type: http
          seq: 6
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "null"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: 'null'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON number response
          type: http
          seq: 12
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "3.1"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '3.1'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON response
          type: http
          seq: 2
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "contentJSON": { "message": "hello" }
              }
        runtime:
          assertions:
            - expression: res.body.message
              operator: eq
              value: hello
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON string response
          type: http
          seq: 7
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "\\"ok\\""
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: ok
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON string with quotes response
          type: http
          seq: 8
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "contentJSON": "\\"ok\\""
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '''"ok"'''
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON true response
          type: http
          seq: 10
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "true"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: 'true'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test JSON unsafe-int response
          type: http
          seq: 13
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "90071992547409919876"
              }
        runtime:
          assertions:
            - expression: res.body.toString()
              operator: eq
              value: '90071992547409920000'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
        docs: 'Note: This test is not perfect, we should match the unparsed raw-response with the expected string version of the unsafe-integer'
      - info:
          name: test binary response
          type: http
          seq: 4
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "type": "application/octet-stream",
                "contentBase64": "+Z1P82iH1wmbILfvnhvjQVbVAktP4TzltpxYD74zNyA="
              }
        runtime:
          scripts:
            - type: tests
              code: |-
                test("response matches the expectation after utf-8 decoding(needs improvement)", function () {
                  expect(res.getStatus()).to.equal(200);
                  const dataBinary = Buffer.from("+Z1P82iH1wmbILfvnhvjQVbVAktP4TzltpxYD74zNyA=", "base64"); 
                  expect(res.body).to.equal(dataBinary.toString("utf-8"));
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
        docs: |-
          Note:

          This test is not perfect and needs to be improved by direclty matching expected binary data with raw-response.

          Currently res.body is decoded with \`utf-8\` by default and looses data in the process. We need some property in \`res\` which gives access to raw-data/Buffer.
      - info:
          name: test html response
          type: http
          seq: 5
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/html" },
                "content": "<h1>hello</h1>"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: <h1>hello</h1>
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test image response
          type: http
          seq: 3
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "type": "image/png",
                "contentBase64": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURQCqAP///59OGOoAAAABYktHRAH/Ai3eAAAAB3RJTUUH6QMHCwUNKHvFmgAAABRJREFUOMtjYBgFo2AUjIJRQE8AAAV4AAEpcbn8AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTAzLTA3VDExOjA1OjEzKzAwOjAwQkgGWgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wMy0wN1QxMTowNToxMyswMDowMDMVvuYAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDMtMDdUMTE6MDU6MTMrMDA6MDBkAJ85AAAAAElFTkSuQmCC"
              }
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test invalid JSON response with formatting
          type: http
          seq: 19
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/json" },
                "content": "hello\\n\\tworld"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: hello\\n\\tworld
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text response with formatting
          type: http
          seq: 18
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain" },
                "content": "hello\\n\\tworld"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: hello\\n\\tworld
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text response
          type: http
          seq: 1
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain" },
                "content": "hello"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: hello
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text utf16 response
          type: http
          seq: 14
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain; charset=utf-16" },
                "contentBase64": "dABoAGkAcwAgAGkAcwAgAGUAbgBjAG8AZABlAGQAIAB3AGkAdABoACAAdQB0AGYAMQA2AA=="
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '"this is encoded with utf16"'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text utf16-be with BOM response
          type: http
          seq: 15
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain; charset=utf-16" },
                "contentBase64": "/v8AdABoAGkAcwAgAGkAcwAgAGUAbgBjAG8AZABlAGQAIAB3AGkAdABoACAAdQB0AGYAMQA2AC0AYgBlACAAdwBpAHQAaAAgAEIATwBN"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '"this is encoded with utf16-be with BOM"'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text utf16-le with BOM response
          type: http
          seq: 16
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain; charset=utf-16" },
                "contentBase64": "//50AGgAaQBzACAAaQBzACAAZQBuAGMAbwBkAGUAZAAgAHcAaQB0AGgAIAB1AHQAZgAxADYALQBsAGUAIAB3AGkAdABoACAAQgBPAE0A"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '"this is encoded with utf16-le with BOM"'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test plain text utf8 with BOM response
          type: http
          seq: 17
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "text/plain; charset=utf8" },
                "contentBase64": "77u/dGhpcyBpcyB1dGY4IGVuY29kZWQgd2l0aCBCT00sIHdoeSBub3Q/"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: '"this is utf8 encoded with BOM, why not?"'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: test xml response
          type: http
          seq: 9
        http:
          method: POST
          url: '{{httpfaker}}/api/echo/custom'
          body:
            type: json
            data: |-
              {
                "headers": { "content-type": "application/xml" },
                "content": "<message>hello</message>"
              }
        runtime:
          assertions:
            - expression: res.body
              operator: eq
              value: <message>hello</message>
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: scripting
      type: folder
    items:
      - info:
          name: api
          type: folder
        items:
          - info:
              name: bru
              type: folder
            request:
              variables:
                - name: folder-var
                  value: folder-var-value
            items:
              - info:
                  name: cookies
                  type: folder
                  seq: 17
                request:
                  auth: inherit
                items:
                  - info:
                      name: Redirect Cookie Save
                      type: http
                      seq: 9
                    http:
                      method: GET
                      url: http://localhost:8081/api/mix?s=302&c=foo:bar&r=http://127.0.0.1:8081/query
                      params:
                        - name: s
                          value: '302'
                          type: query
                        - name: c
                          value: foo:bar
                          type: query
                        - name: r
                          value: http://127.0.0.1:8081/query
                          type: query
                      auth: inherit
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            const cookieData = await jar.getCookie(
                              "http://localhost:8081",
                              "foo"
                            );

                            test("should store redirect cookie under initial request domain", function () {
                              expect(cookieData).to.not.be.undefined;
                              expect(cookieData.key).to.equal("foo");
                              expect(cookieData.value).to.equal("bar");
                            });

                            jar.clear();
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: clear
                      type: http
                      seq: 6
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            await jar.setCookies('https://testbench-sanity.usebruno.com', [
                              {
                                key: 'test_cookie_1',
                                value: 'value1',
                                path: '/',
                                secure: true
                              },
                              {
                                key: 'test_cookie_2', 
                                value: 'value2',
                                path: '/',
                                secure: true
                              }
                            ]);

                            console.log("Test cookies set up for clear test");
                        - type: after-response
                          code: |-
                            const jar = bru.cookies.jar()

                            const cookiesBeforeClear = await jar.getCookies('https://testbench-sanity.usebruno.com');
                            console.log(\`Found \${cookiesBeforeClear.length} cookies before clearing\`);

                            test("cookies should exist before clearing", function() {
                              expect(cookiesBeforeClear).to.be.an('array');
                              expect(cookiesBeforeClear.length).to.be.greaterThan(0);
                            });

                            await jar.clear();
                            console.log("Cookie jar cleared");
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            test("should have no cookies after clearing", async function() {
                              const cookiesAfterClear = await jar.getCookies('https://testbench-sanity.usebruno.com');
                              expect(cookiesAfterClear).to.be.an('array');
                              expect(cookiesAfterClear.length).to.equal(0);
                            });

                            jar.clear(function(error) {
                              test("should successfully clear with callback", function() {
                                expect(error).to.be.null;
                              });
                            });
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: clearScope
                      type: http
                      seq: 14
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()
                            await jar.clear();

                            // Set cookies on two different domains:
                            // - localhost matches the request URL, so bru.cookies.clear() targets it
                            // - other.example.com should be left untouched by bru.cookies.clear()
                            const host = bru.getEnvVar('localhost');
                            await jar.setCookies(host, [
                              { key: "a", value: "1", path: "/" },
                              { key: "b", value: "2", path: "/" }
                            ]);

                            await jar.setCookie("https://other.example.com", {
                              key: "c",
                              value: "3",
                              path: "/",
                              secure: true
                            });
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()
                            const host = bru.getEnvVar('localhost');

                            // bru.cookies sees only the current request URL's cookies
                            await test("bru.cookies.clear() only clears cookies for current URL", async function() {
                              // Verify cookies exist before clear
                              const before = await jar.getCookies(host);
                              expect(before.length).to.be.at.least(1);

                              // bru.cookies.clear() clears only current request URL cookies
                              await bru.cookies.clear();

                              // Current URL's cookies should be gone
                              const after = await jar.getCookies(host);
                              expect(after.length).to.equal(0);

                              // Other domain cookies should still exist
                              const otherDomain = await jar.getCookies("https://other.example.com");
                              expect(otherDomain.length).to.be.at.least(1);
                              expect(otherDomain[0].key).to.equal("c");
                            });

                            await test("jar.clear() clears ALL cookies globally", async function() {
                              // Re-add a cookie on main domain
                              await jar.setCookie(host, {
                                key: "d",
                                value: "4",
                                path: "/"
                              });

                              // jar.clear() clears everything
                              await jar.clear();

                              const main = await jar.getCookies(host);
                              const other = await jar.getCookies("https://other.example.com");
                              expect(main.length).to.equal(0);
                              expect(other.length).to.equal(0);
                            });
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: crossDomainIsolation
                      type: http
                      seq: 15
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()
                            await jar.clear();

                            await jar.setCookie("https://testbench-sanity.usebruno.com", {
                              key: "domainA",
                              value: "valueA",
                              path: "/",
                              secure: true
                            });

                            await jar.setCookie("https://other.example.com", {
                              key: "domainB",
                              value: "valueB",
                              path: "/",
                              secure: true
                            });
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            await test("cookies on domain A are not visible on domain B", async function() {
                              const cookiesA = await jar.getCookies("https://testbench-sanity.usebruno.com");
                              const cookiesB = await jar.getCookies("https://other.example.com");

                              const keysA = cookiesA.map(function(c) { return c.key; });
                              const keysB = cookiesB.map(function(c) { return c.key; });

                              expect(keysA).to.include("domainA");
                              expect(keysA).to.not.include("domainB");

                              expect(keysB).to.include("domainB");
                              expect(keysB).to.not.include("domainA");
                            });

                            await test("bru.cookies.get() only returns cookies for the current request URL", function() {
                              // bru.cookies reads from the current request's URL
                              // domainB cookie should not be accessible via bru.cookies
                              expect(bru.cookies.has("domainB")).to.be.false;
                            });

                            await test("jar.getCookie() respects domain isolation", async function() {
                              const cookieA = await jar.getCookie("https://testbench-sanity.usebruno.com", "domainA");
                              const cookieBOnA = await jar.getCookie("https://testbench-sanity.usebruno.com", "domainB");

                              expect(cookieA).to.not.be.null;
                              expect(cookieA.value).to.equal("valueA");
                              expect(cookieBOnA).to.be.null;
                            });

                            await jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: deleteCookie
                      type: http
                      seq: 5
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            await jar.setCookies('https://testbench-sanity.usebruno.com', [
                              {
                                key: 'cookie_to_delete',
                                value: 'will_be_deleted',
                                path: '/',
                                secure: true
                              },
                              {
                                key: 'cookie_to_keep', 
                                value: 'should_remain',
                                path: '/',
                                secure: true
                              }
                            ]);

                            console.log("Test cookies set up");
                        - type: after-response
                          code: |-
                            const jar = bru.cookies.jar()

                            const cookiesBefore = await jar.getCookies('https://testbench-sanity.usebruno.com');
                            console.log(\`Found \${cookiesBefore.length} cookies before deletion\`);

                            const targetCookie = await jar.getCookie('https://testbench-sanity.usebruno.com', 'cookie_to_delete');
                            test("cookie should exist before deletion", function() {
                              expect(targetCookie).to.not.be.null;
                              expect(targetCookie.key).to.equal('cookie_to_delete');
                            });

                            await jar.deleteCookie('https://testbench-sanity.usebruno.com', 'cookie_to_delete');
                            console.log("Cookie deleted");
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            test("should have deleted the target cookie", async function() {
                              const deletedCookie = await jar.getCookie('https://testbench-sanity.usebruno.com', 'cookie_to_delete');
                              expect(deletedCookie).to.be.null;
                            });

                            test("should keep other cookies intact", async function() {
                              const cookieToKeep = await jar.getCookie('https://testbench-sanity.usebruno.com', 'cookie_to_keep');
                              expect(cookieToKeep).to.not.be.null;
                              expect(cookieToKeep.key).to.equal('cookie_to_keep');
                            });

                            jar.deleteCookie("https://testbench-sanity.usebruno.com", "cookie_to_keep", function(error) {
                              test("should successfully delete with callback", function() {
                                expect(error).to.be.null;
                              });
                            });

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: deleteCookies
                      type: http
                      seq: 7
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            // Set up test cookies before the request
                            try {
                              await jar.setCookies('https://testbench-sanity.usebruno.com', [
                                {
                                  key: 'test_cookie_1',
                                  value: 'value1',
                                  path: '/',
                                  httpOnly: false,
                                  secure: true
                                },
                                {
                                  key: 'test_cookie_2', 
                                  value: 'value2',
                                  path: '/',
                                  httpOnly: true,
                                  secure: true
                                },
                                {
                                  key: 'test_cookie_3',
                                  value: 'value3',
                                  path: '/api',
                                  httpOnly: false,
                                  secure: true
                                }
                              ]);
                              
                              console.log("Test cookies set up successfully in pre-request script");
                              
                              // Verify cookies were set
                              const cookies = await jar.getCookies('https://testbench-sanity.usebruno.com');
                              console.log(\`\${cookies.length} cookies set for domain\`);
                              
                            } catch (error) {
                              console.error("Failed to set up test cookies:", error);
                              throw new Error(\`Pre-request cookie setup failed: \${error.message || error}\`);
                            }
                        - type: after-response
                          code: |-
                            const jar = bru.cookies.jar()

                            // Verify cookies exist before deletion
                            try {
                              const cookiesBeforeDeletion = await jar.getCookies('https://testbench-sanity.usebruno.com');

                              test("cookies should exist before clearing", function() {
                              expect(cookiesBeforeDeletion).to.be.an('array');
                              expect(cookiesBeforeDeletion.length).to.be.greaterThan(0);
                            });
                              
                              
                              if (cookiesBeforeDeletion.length === 0) {
                                throw new Error("No cookies found to delete - setup may have failed");
                              }
                              
                              // Delete all cookies for the domain
                              await jar.deleteCookies('https://testbench-sanity.usebruno.com');
                              console.log("deleteCookies operation completed in post-response");
                              
                              // Verify deletion worked
                              const cookiesAfterDeletion = await jar.getCookies('https://testbench-sanity.usebruno.com');
                              console.log(\`Found \${cookiesAfterDeletion.length} cookies after deletion\`);
                              
                            } catch (error) {
                              console.error("Delete cookies error in post-response:", error);
                              throw new Error(\`Failed to delete cookies in post-response: \${error.message || error}\`);
                            }
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            jar.getCookies("https://testbench-sanity.usebruno.com", function(error, remainingCookies) {
                              if(error) {
                                console.error("Error checking remaining cookies:", error)
                                throw new Error(\`Failed to get remaining cookies: \${error.message || error}\`)
                              }
                              
                              test("should have no cookies remaining after deletion", function() {
                                expect(remainingCookies).to.be.an('array');
                                expect(remainingCookies.length).to.equal(0);
                                console.log("✓ Confirmed: no cookies remain for domain after deleteCookies");
                              });
                            });

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: directGet
                      type: http
                      seq: 10
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            const host = bru.getEnvVar('localhost');
                            await jar.setCookie(host, {
                              key: 'session',
                              value: 'abc123',
                              path: '/'
                            });
                        - type: tests
                          code: |-
                            test("get() should return value for existing cookie", function() {
                              expect(bru.cookies.get('session')).to.equal('abc123');
                            });

                            test("get() should return undefined for nonexistent cookie", function() {
                              expect(bru.cookies.get('nonexistent')).to.be.undefined;
                            });

                            test("has() should return true for existing cookie", function() {
                              expect(bru.cookies.has('session')).to.be.true;
                            });

                            test("has() should return false for nonexistent cookie", function() {
                              expect(bru.cookies.has('nonexistent')).to.be.false;
                            });

                            test("has() with value should return true when value matches", function() {
                              expect(bru.cookies.has('session', 'abc123')).to.be.true;
                            });

                            test("has() with value should return false when value does not match", function() {
                              expect(bru.cookies.has('session', 'wrong')).to.be.false;
                            });

                            const jar = bru.cookies.jar()
                            await jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: directIteration
                      type: http
                      seq: 12
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            const host = bru.getEnvVar('localhost');
                            await jar.setCookies(host, [
                              {
                                key: 'x',
                                value: '10',
                                path: '/'
                              },
                              {
                                key: 'y',
                                value: '20',
                                path: '/'
                              }
                            ]);
                        - type: tests
                          code: |-
                            test("each() should iterate over all cookies", function() {
                              const keys = [];
                              bru.cookies.each(function(cookie) {
                                keys.push(cookie.key);
                              });
                              expect(keys).to.include('x');
                              expect(keys).to.include('y');
                            });

                            test("find() should return matching cookie", function() {
                              const cookie = bru.cookies.find(function(c) { return c.key === 'x'; });
                              expect(cookie).to.have.property('value', '10');
                            });

                            test("find() should return undefined when no match", function() {
                              const cookie = bru.cookies.find(function(c) { return c.key === 'zzz'; });
                              expect(cookie).to.be.undefined;
                            });

                            test("filter() should return array of matching cookies", function() {
                              const result = bru.cookies.filter(function(c) { return c.key === 'y'; });
                              expect(result).to.be.an('array');
                              expect(result.length).to.equal(1);
                              expect(result[0]).to.have.property('value', '20');
                            });

                            test("map() should transform cookies", function() {
                              const keys = bru.cookies.map(function(c) { return c.key; });
                              expect(keys).to.be.an('array');
                              expect(keys).to.include('x');
                              expect(keys).to.include('y');
                            });

                            test("reduce() should accumulate over cookies", function() {
                              const result = bru.cookies.reduce(function(acc, c) { return acc + c.key + ','; }, '');
                              expect(result).to.be.a('string');
                              expect(result).to.contain('x,');
                              expect(result).to.contain('y,');
                            });

                            test("indexOf() should find a cookie by structural equality", function() {
                              const cookie = bru.cookies.one('x');
                              const idx = bru.cookies.indexOf(cookie);
                              expect(idx).to.be.at.least(0);
                            });

                            test("indexOf() should return -1 for non-existent cookie", function() {
                              const idx = bru.cookies.indexOf({ key: 'nonexistent', value: 'nope' });
                              expect(idx).to.equal(-1);
                            });

                            test("idx() out-of-bounds should return undefined", function() {
                              const result = bru.cookies.idx(999);
                              expect(result).to.be.undefined;
                            });

                            const jar = bru.cookies.jar()
                            await jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: directReadMethods
                      type: http
                      seq: 11
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            const host = bru.getEnvVar('localhost');
                            await jar.setCookies(host, [
                              {
                                key: 'alpha',
                                value: 'one',
                                path: '/'
                              },
                              {
                                key: 'beta',
                                value: 'two',
                                path: '/'
                              }
                            ]);
                        - type: tests
                          code: |-
                            test("one() should return full cookie object by name", function() {
                              const cookie = bru.cookies.one('alpha');
                              expect(cookie).to.have.property('key', 'alpha');
                              expect(cookie).to.have.property('value', 'one');
                            });

                            test("one() should return undefined for nonexistent cookie", function() {
                              expect(bru.cookies.one('nonexistent')).to.be.undefined;
                            });

                            test("all() should return an array with at least 2 items", function() {
                              const cookies = bru.cookies.all();
                              expect(cookies).to.be.an('array');
                              expect(cookies.length).to.be.at.least(2);
                            });

                            test("count() should be at least 2", function() {
                              expect(bru.cookies.count()).to.be.at.least(2);
                            });

                            test("idx() should return a cookie object at index 0", function() {
                              const cookie = bru.cookies.idx(0);
                              expect(cookie).to.have.property('key');
                              expect(cookie).to.have.property('value');
                            });

                            test("toObject() should return object with cookie key-value pairs", function() {
                              const obj = bru.cookies.toObject();
                              expect(obj).to.be.an('object');
                              expect(obj).to.have.property('alpha', 'one');
                              expect(obj).to.have.property('beta', 'two');
                            });

                            test("toString() should return a string containing cookie pairs", function() {
                              const str = bru.cookies.toString();
                              expect(str).to.be.a('string');
                              expect(str).to.contain('alpha=one');
                            });

                            test("toJSON() should return cloned array of all cookies", function() {
                              const json = bru.cookies.toJSON();
                              expect(json).to.be.an('array');
                              expect(json.length).to.be.at.least(2);
                              expect(json[0]).to.have.property('key');
                              expect(json[0]).to.have.property('value');
                            });

                            const jar = bru.cookies.jar()
                            await jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: directWrite
                      type: http
                      seq: 13
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()
                            await jar.clear();
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            await bru.cookies.add({ key: 'a', value: '1' });
                            test("add() should add a new cookie", function() {
                              expect(bru.cookies.get('a')).to.equal('1');
                            });

                            await bru.cookies.upsert({ key: 'a', value: '2' });
                            test("upsert() should update an existing cookie", function() {
                              expect(bru.cookies.get('a')).to.equal('2');
                            });

                            await bru.cookies.upsert({ key: 'newCookie', value: 'inserted' });
                            test("upsert() should insert a cookie that does not exist", function() {
                              expect(bru.cookies.has('newCookie')).to.be.true;
                              expect(bru.cookies.get('newCookie')).to.equal('inserted');
                            });
                            await bru.cookies.remove('newCookie');

                            await bru.cookies.remove('a');
                            test("remove() should remove a cookie", function() {
                              expect(bru.cookies.has('a')).to.be.false;
                            });

                            await bru.cookies.add({ key: 'b', value: '3' });
                            await bru.cookies.delete('b');
                            test("delete() should delete a cookie", function() {
                              expect(bru.cookies.has('b')).to.be.false;
                            });

                            await bru.cookies.add({ key: 'c', value: '4' });
                            test("clear() should remove all cookies after add", function() {
                              expect(bru.cookies.count()).to.be.at.least(1);
                            });
                            await bru.cookies.clear();
                            test("clear() should leave zero cookies", function() {
                              expect(bru.cookies.count()).to.equal(0);
                            });

                            await jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: getCookie
                      type: http
                      seq: 1
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            jar.setCookie("https://testbench-sanity.usebruno.com", "name", "value")
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()
                            // Await so the callback runs before jar.clear() below; otherwise the test script can finish
                            // before the callback registers/runs the test, causing a flaky failure (e.g. in CI).
                            await jar.getCookie("https://testbench-sanity.usebruno.com", "name", function(error, data) {
                              if(error) {
                                console.error("Cookie retrieval error:", error)
                                throw new Error(\`Failed to get cookie: \${error.message || error}\`)
                              }
                              
                              test("should successfully retrieve cookie data", function() {
                                expect(data).to.have.property('key');
                                expect(data).to.have.property('value');
                                expect(data.key).to.equal("name");
                                expect(data.value).to.be.a('string');
                                expect(data.value).to.not.be.empty;
                                expect(data.domain).to.include('usebruno.com');
                                console.log("Retrieved cookie:", data);
                              });
                            })

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: getCookies
                      type: http
                      seq: 3
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()
                            await jar.clear();

                            await jar.setCookies("https://testbench-sanity.usebruno.com", [
                              { key: "session", value: "abc123", path: "/", secure: true },
                              { key: "token", value: "xyz789", path: "/", secure: true }
                            ]);
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            jar.getCookies("https://testbench-sanity.usebruno.com", function(error, data) {
                              if(error) {
                                console.error("Cookies retrieval error:", error)
                                throw new Error(\`Failed to get cookies: \${error.message || error}\`)
                              }
                              
                              test("should successfully retrieve cookies array", function() {
                                expect(error).to.be.null;
                                expect(data).to.not.be.null;
                                expect(data).to.be.an('array');
                                console.log("Retrieved cookies count:", data.length);
                              });
                              
                            test("should have valid cookie structure in array", function() {
                                  data.forEach((cookie, index) => {
                                    expect(cookie).to.have.property('key');
                                    expect(cookie).to.have.property('value');
                                    expect(cookie.key).to.be.a('string');
                                    expect(cookie.value).to.be.a('string');
                                    expect(cookie.domain).to.include('usebruno.com');
                                    console.log(\`Cookie \${index + 1}:\`, cookie);
                                  });
                                });
                                
                                test("should contain expected cookie properties", function() {
                                  const cookieKeys = data.map(cookie => cookie.key);
                                  expect(cookieKeys).to.be.an('array');
                                  console.log("Found cookie keys:", cookieKeys);
                                });
                            })

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: hasCookie
                      type: http
                      seq: 10
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            jar.setCookie("https://testbench-sanity.usebruno.com", "existing_cookie", "some_value")
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            test("should return true for a cookie that exists", async function() {
                              const exists = await jar.hasCookie('https://testbench-sanity.usebruno.com', 'existing_cookie');
                              expect(exists).to.be.true;
                            });

                            test("should return false for a cookie that does not exist", async function() {
                              const exists = await jar.hasCookie('https://testbench-sanity.usebruno.com', 'nonexistent_cookie');
                              expect(exists).to.be.false;
                            });

                            jar.hasCookie("https://testbench-sanity.usebruno.com", "existing_cookie", function(error, exists) {
                              test("should work with callback pattern", function() {
                                expect(error).to.be.null;
                                expect(exists).to.be.true;
                              });
                            });

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: setCookie
                      type: http
                      seq: 2
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            // Set cookie before the request
                            try {
                              await jar.setCookie("https://testbench-sanity.usebruno.com", {
                                key: "auth",
                                value: "1234",
                                path: "/path"
                              });
                              
                              console.log("Cookie set successfully in pre-request script");
                              
                            } catch (error) {
                              console.error("Cookie setting error in pre-request:", error);
                              throw new Error(\`Pre-request setCookie failed: \${error.message || error}\`);
                            }
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            test("should have set cookie successfully", function() {
                              console.log("Verifying cookie set in pre-request script");
                            });

                            // Test: Verify the cookie was set by retrieving it
                            const cookieData = await jar.getCookie("https://testbench-sanity.usebruno.com/path", "auth");

                            test("should retrieve the set cookie with correct properties", function() {
                                expect(cookieData.key).to.equal("auth");
                                expect(cookieData.value).to.equal("1234");
                                expect(cookieData.path).to.equal("/path");
                                expect(cookieData.domain).to.include('usebruno.com');
                                console.log("Retrieved and verified cookie:", cookieData);
                            });

                            // Test: Additional verification - check all cookies for the domain
                            const allCookies = await jar.getCookies("https://testbench-sanity.usebruno.com/path");

                            test("should find the cookie in domain cookie list", function() {
                              expect(allCookies).to.be.an('array');
                              expect(allCookies.length).to.be.at.least(1);
                              
                              const authCookie = allCookies.find(c => c.key === 'auth');
                              expect(authCookie).to.not.be.undefined;
                              expect(authCookie.value).to.equal("1234");
                              
                              console.log("All cookies for domain:", allCookies.map(c => ({ key: c.key, value: c.value, path: c.path })));
                            });

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: setCookie header inclusion
                      type: http
                      seq: 6
                    http:
                      method: POST
                      url: '{{echo-host}}'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar();

                            // Set a cookie that should be sent with the upcoming request
                            await jar.setCookie('https://echo.usebruno.com', {
                              key: 'auth',
                              value: 'token123',
                              path: '/',
                              secure: false
                            });
                        - type: tests
                          code: |-
                            const cookieHeader = res.getHeader('cookie');

                            test('should attach auth cookie in request headers', function () {
                              expect(cookieHeader).to.be.a('string');
                              expect(cookieHeader).to.include('auth=token123');
                            });

                            // Clean up the jar so other tests are not affected
                            const jar = bru.cookies.jar();
                            await jar.clear();
                    settings:
                      encodeUrl: false
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: setCookies
                      type: http
                      seq: 4
                    http:
                      method: GET
                      url: '{{localhost}}/ping'
                      auth: inherit
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            const jar = bru.cookies.jar()

                            // Set multiple cookies before the request
                            try {
                              await jar.setCookies('https://example.com', [
                                {
                                  key: 'auth',
                                  value: 'abc123',
                                  path: '/path',          
                                  httpOnly: true,
                                  secure: true,
                                  expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                                },
                                {
                                  key: 'session',
                                  value: 'xyz789',
                                  path: '/foo',          
                                  httpOnly: true,
                                  secure: true,
                                }
                              ]);
                              
                              console.log("Multiple cookies set successfully in pre-request script");
                              
                            } catch (error) {
                              console.error("setCookies operation failed in pre-request:", error);
                              throw new Error(\`Pre-request setCookies failed: \${error.message || error}\`);
                            }
                        - type: tests
                          code: |-
                            const jar = bru.cookies.jar()

                            test("should have set multiple cookies successfully", function() {
                              console.log("Verifying cookies set in pre-request script");
                            });

                            // Test: Verify first cookie was set correctly
                            const authCookie = await jar.getCookie('https://example.com/path', 'auth');

                            test("should retrieve first cookie with correct properties", function() {
                                expect(authCookie.key).to.equal("auth");
                                expect(authCookie.value).to.equal("abc123");
                                expect(authCookie.path).to.equal("/path");
                                expect(authCookie.httpOnly).to.be.true;
                                expect(authCookie.secure).to.be.true;
                                expect(authCookie.domain).to.include('example.com');
                                console.log("Auth cookie verified:", authCookie);
                            });

                            // Test: Verify second cookie was set correctly
                            const sessionCookie = await jar.getCookie('https://example.com/foo', 'session');

                            test("should retrieve second cookie with correct properties", function() {
                              expect(sessionCookie).to.not.be.null;
                              if (sessionCookie) {
                                expect(sessionCookie.key).to.equal("session");
                                expect(sessionCookie.value).to.equal("xyz789");
                                expect(sessionCookie.path).to.equal("/foo");
                                expect(sessionCookie.httpOnly).to.be.true;
                                expect(sessionCookie.secure).to.be.true;
                                expect(sessionCookie.domain).to.include('example.com');
                                console.log("Session cookie verified:", sessionCookie);
                              }
                            });

                            jar.clear()
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
              - info:
                  name: deleteAllCollectionVars
                  type: http
                  seq: 28
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because deleteAllCollectionVars does not update the UI
                        bru.runner.skipRequest();
                        return;
                        bru.setCollectionVar("testDelAllCollectionA", "a");
                        bru.setCollectionVar("testDelAllCollectionB", "b");
                    - type: tests
                      code: |-
                        const savedCollectionVars = bru.getAllCollectionVars();
                        bru.deleteAllCollectionVars();

                        test("should delete all collection vars", function() {
                          const valA = bru.getCollectionVar("testDelAllCollectionA");
                          const valB = bru.getCollectionVar("testDelAllCollectionB");
                          expect(valA).to.be.undefined;
                          expect(valB).to.be.undefined;
                        });

                        // Restore collection vars for subsequent requests
                        for (const [key, value] of Object.entries(savedCollectionVars)) {
                          bru.setCollectionVar(key, value);
                        }
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: deleteAllEnvVars
                  type: http
                  seq: 23
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: bru.setEnvVar("testDelAllEnvVar", "to-be-deleted");
                    - type: tests
                      code: |-
                        const savedEnvVars = bru.getAllEnvVars();
                        bru.deleteAllEnvVars();

                        test("should delete all env vars", function() {
                          const val = bru.getEnvVar("testDelAllEnvVar");
                          expect(val).to.be.undefined;
                        });

                        test("should preserve env name after deleting all vars", function() {
                          const envName = bru.getEnvName();
                          expect(envName).to.equal("Prod");
                        });

                        // Restore env vars for subsequent requests
                        for (const [key, value] of Object.entries(savedEnvVars)) {
                          bru.setEnvVar(key, value);
                        }
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: deleteAllGlobalEnvVars
                  type: http
                  seq: 21
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because deleteAllGlobalEnvVars does not update the UI
                        bru.runner.skipRequest();
                        return;
                        bru.setGlobalEnvVar("testDelAllGlobalA", "a");
                        bru.setGlobalEnvVar("testDelAllGlobalB", "b");
                    - type: tests
                      code: |-
                        const savedGlobalEnvVars = bru.getAllGlobalEnvVars();
                        bru.deleteAllGlobalEnvVars();

                        test("should delete all global env vars", function() {
                          const valA = bru.getGlobalEnvVar("testDelAllGlobalA");
                          const valB = bru.getGlobalEnvVar("testDelAllGlobalB");
                          expect(valA).to.be.undefined;
                          expect(valB).to.be.undefined;
                        });

                        // Restore global env vars for subsequent requests
                        for (const [key, value] of Object.entries(savedGlobalEnvVars)) {
                          bru.setGlobalEnvVar(key, value);
                        }
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: deleteCollectionVar
                  type: http
                  seq: 27
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because deleteCollectionVar does not update the UI
                        bru.runner.skipRequest();
                        return;
                        bru.setCollectionVar("testDeleteCollectionVar", "to-be-deleted");
                        bru.deleteCollectionVar("testDeleteCollectionVar");
                    - type: tests
                      code: |-
                        test("should delete collection var", function() {
                          const val = bru.getCollectionVar("testDeleteCollectionVar");
                          expect(val).to.be.undefined;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: deleteGlobalEnvVar
                  type: http
                  seq: 19
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because deleteGlobalEnvVar does not update the UI
                        bru.runner.skipRequest();
                        return;
                        bru.setGlobalEnvVar("testDeleteGlobalEnvVar", "to-be-deleted");
                        bru.deleteGlobalEnvVar("testDeleteGlobalEnvVar");
                    - type: tests
                      code: |-
                        test("should delete global env var", function() {
                          const val = bru.getGlobalEnvVar("testDeleteGlobalEnvVar");
                          expect(val).to.be.undefined;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getAllCollectionVars
                  type: http
                  seq: 29
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because getAllCollectionVars does not update the UI
                        bru.runner.skipRequest();
                        return;
                        bru.setCollectionVar("testCollectionA", "valueA");
                        bru.setCollectionVar("testCollectionB", "valueB");
                    - type: tests
                      code: |-
                        test("should return all collection vars", function() {
                          const vars = bru.getAllCollectionVars();
                          expect(vars.testCollectionA).to.equal("valueA");
                          expect(vars.testCollectionB).to.equal("valueB");
                        });

                        test("should return a shallow copy", function() {
                          const vars = bru.getAllCollectionVars();
                          vars.testCollectionA = "mutated";
                          const vars2 = bru.getAllCollectionVars();
                          expect(vars2.testCollectionA).to.equal("valueA");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getAllEnvVars
                  type: http
                  seq: 22
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should return all env vars including host", function() {
                          const vars = bru.getAllEnvVars();
                          expect(vars.host).to.be.a("string");
                        });

                        test("should not include __name__ in result", function() {
                          const vars = bru.getAllEnvVars();
                          expect(vars.__name__).to.be.undefined;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getAllGlobalEnvVars
                  type: http
                  seq: 20
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        bru.setGlobalEnvVar("testGlobalA", "valueA");
                        bru.setGlobalEnvVar("testGlobalB", "valueB");
                    - type: tests
                      code: |-
                        test("should return all global env vars", function() {
                          const vars = bru.getAllGlobalEnvVars();
                          expect(vars.testGlobalA).to.equal("valueA");
                          expect(vars.testGlobalB).to.equal("valueB");
                        });

                        test("should return a shallow copy", function() {
                          const vars = bru.getAllGlobalEnvVars();
                          vars.testGlobalA = "mutated";
                          const vars2 = bru.getAllGlobalEnvVars();
                          expect(vars2.testGlobalA).to.equal("valueA");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getAllVars
                  type: http
                  seq: 24
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        bru.setVar("testGetAllVarsA", "alphaValue");
                        bru.setVar("testGetAllVarsB", "betaValue");
                    - type: tests
                      code: |-
                        test("should return all runtime vars", function() {
                          const vars = bru.getAllVars();
                          expect(vars.testGetAllVarsA).to.equal("alphaValue");
                          expect(vars.testGetAllVarsB).to.equal("betaValue");
                        });

                        test("should return a shallow copy", function() {
                          const vars = bru.getAllVars();
                          vars.testGetAllVarsA = "mutated";
                          const vars2 = bru.getAllVars();
                          expect(vars2.testGetAllVarsA).to.equal("alphaValue");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getCollectionName
                  type: http
                  seq: 13
                http:
                  method: GET
                  url: '{{host}}/ping'
                  auth: inherit
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("Check if collection name is bruno-testbench", function () {
                            expect(bru.getCollectionName()).to.eql("bruno-testbench");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getCollectionVar
                  type: http
                  seq: 9
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should get collection var in scripts", function() {
                          const testVar = bru.getCollectionVar("collection-var");
                          expect(testVar).to.equal("collection-var-value");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getEnvName
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const envName = bru.getEnvName();
                        bru.setVar("testEnvName", envName);
                    - type: tests
                      code: |-
                        test("should get env name in scripts", function() {
                          const testEnvName = bru.getVar("testEnvName");
                          expect(testEnvName).to.equal("Prod");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getEnvVar
                  type: http
                  seq: 2
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should get env var in scripts", function() {
                          const host = bru.getEnvVar("host")
                          expect(host).to.equal("https://testbench-sanity.usebruno.com");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getFolderVar
                  type: http
                  seq: 8
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should get folder var in scripts", function() {
                          const testVar = bru.getFolderVar("folder-var");
                          expect(testVar).to.equal("folder-var-value");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getProcessEnv
                  type: http
                  seq: 6
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("bru.getProcessEnv()", function() {
                          const v = bru.getProcessEnv("PROC_ENV_VAR");
                          expect(v).to.equal("woof");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getRequestVar
                  type: http
                  seq: 7
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  variables:
                    - name: request-var
                      value: request-var-value
                  scripts:
                    - type: tests
                      code: |-
                        test("should get request var in scripts", function() {
                          const testVar = bru.getRequestVar("request-var");
                          expect(testVar).to.equal("request-var-value");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getVar
                  type: http
                  seq: 5
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should get var in scripts", function() {
                          const testSetVar = bru.getVar("testSetVar");
                          expect(testSetVar).to.equal("bruno-test-87267");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: hasCollectionVar
                  type: http
                  seq: 26
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should return true for existing collection var", function() {
                          const exists = bru.hasCollectionVar("collection-var");
                          expect(exists).to.be.true;
                        });

                        test("should return false for nonexistent collection var", function() {
                          const exists = bru.hasCollectionVar("nonexistent-collection-var");
                          expect(exists).to.be.false;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: interpolate
                  type: http
                  seq: 13
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("should interpolate envs", function() {
                          const interpolated = bru.interpolate("url: {{host}}")
                          expect(interpolated).to.equal("url: https://testbench-sanity.usebruno.com");
                        });

                        test("should interpolate random variables", function() {
                          const a = bru.interpolate("{{$randomInt}}")
                          const b = bru.interpolate("{{$randomInt}}")
                          expect(a).to.not.equal(b)
                        });

                        const randomObj = {
                          host: "{{host}}",
                          int: "{{$randomInt}}",
                          timestamp: "{{$timestamp}}"
                        }

                        test("should interpolate objects with vars, random vars", function() {
                          const objA = bru.interpolate(randomObj)
                          const objB = bru.interpolate(randomObj)
                          
                          expect(objA).to.be.an("object")
                          expect(objB).to.be.an("object")
                          expect(objA).to.not.deep.eql(objB)
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: isSafeMode
                  type: http
                  seq: 18
                http:
                  method: GET
                  url: '{{host}}/ping'
                  auth: inherit
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        test("bru.isSafeMode() returns true in safe mode", function() {
                            expect(bru.isSafeMode()).to.be.false;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: runRequest-1
                  type: http
                  seq: 10
                http:
                  method: POST
                  url: '{{echo-host}}'
                  body:
                    type: text
                    data: bruno
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // reset values
                        bru.setVar('run-request-runtime-var', null);
                        bru.setEnvVar('run-request-env-var', null);
                        bru.setGlobalEnvVar('run-request-global-env-var', null);

                        // the above vars will be set in the below request
                        const resp = await bru.runRequest('scripting/api/bru/runRequest-2');

                        bru.setVar('run-request-resp', {
                          data: resp?.data,
                          statusText: resp?.statusText,
                          status: resp?.status
                        });
                    - type: tests
                      code: |-
                        test("should get runtime var set in runRequest-2", function() {
                          const val = bru.getVar("run-request-runtime-var");
                          expect(val).to.equal("run-request-runtime-var-value");
                        });

                        test("should get env var set in runRequest-2", function() {
                          const val = bru.getEnvVar("run-request-env-var");
                          expect(val).to.equal("run-request-env-var-value");
                        });

                        test("should get global env var set in runRequest-2", function() {
                          const val = bru.getGlobalEnvVar("run-request-global-env-var");
                          const executionMode = req.getExecutionMode();
                          if (executionMode == 'runner') {
                            expect(val).to.equal("run-request-global-env-var-value");
                          }
                        });

                        test("should get response of runRequest-2", function() {
                          const val = bru.getVar('run-request-resp');
                          expect(JSON.stringify(val)).to.equal(JSON.stringify({
                              "data": "bruno",
                              "statusText": "OK",
                              "status": 200
                            }));
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: runRequest-2
                  type: http
                  seq: 11
                http:
                  method: POST
                  url: '{{echo-host}}'
                  body:
                    type: text
                    data: bruno
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        bru.setVar('run-request-runtime-var', 'run-request-runtime-var-value');
                        bru.setEnvVar('run-request-env-var', 'run-request-env-var-value');
                        bru.setGlobalEnvVar('run-request-global-env-var', 'run-request-global-env-var-value');
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: runRequest
                  type: http
                  seq: 2
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  headers:
                    - name: foo
                      value: bar
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        bru.setVar("runRequest-ping-res-1", null);
                        bru.setVar("runRequest-ping-res-2", null);
                        bru.setVar("runRequest-ping-res-3", null);

                        let pingRes = await bru.runRequest('ping');
                        bru.setVar('runRequest-ping-res-1', {
                          data: pingRes?.data,
                          statusText: pingRes?.statusText,
                          status: pingRes?.status
                        });
                    - type: after-response
                      code: |-
                        let pingRes = await bru.runRequest('ping');
                        bru.setVar('runRequest-ping-res-2', {
                          data: pingRes?.data,
                          statusText: pingRes?.statusText,
                          status: pingRes?.status
                        });
                    - type: tests
                      code: |-
                        const pingRes = await bru.runRequest('ping');
                        bru.setVar('runRequest-ping-res-3', {
                          data: pingRes?.data,
                          statusText: pingRes?.statusText,
                          status: pingRes?.status
                        });

                        test("should run request and return valid response in pre-request script", function() {
                          const expectedPingRes = {
                            data: "pong",
                            statusText: "OK",
                            status: 200
                          };
                          const pingRes = bru.getVar('runRequest-ping-res-1');
                          expect(pingRes).to.eql(expectedPingRes);
                        });

                        test("should run request and return valid response in post-response script", function() {
                          const expectedPingRes = {
                            data: "pong",
                            statusText: "OK",
                            status: 200
                          };
                          const pingRes = bru.getVar('runRequest-ping-res-2');
                          expect(pingRes).to.eql(expectedPingRes);
                        });

                        test("should run request and return valid response in tests script", function() {
                          const expectedPingRes = {
                            data: "pong",
                            statusText: "OK",
                            status: 200
                          };
                          const pingRes = bru.getVar('runRequest-ping-res-3');
                          expect(pingRes).to.eql(expectedPingRes);
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: runner
                  type: folder
                items:
                  - info:
                      name: '1'
                      type: http
                      seq: 1
                    http:
                      method: POST
                      url: https://echo.usebruno.com
                    runtime:
                      scripts:
                        - type: before-request
                          code: bru.setVar('bru-runner-req', 1);
                        - type: after-response
                          code: bru.setVar('bru.runner.skipRequest', true);
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: '2'
                      type: http
                      seq: 2
                    http:
                      method: POST
                      url: https://echo.usebruno.com
                    runtime:
                      scripts:
                        - type: before-request
                          code: bru.runner.skipRequest();
                        - type: after-response
                          code: bru.setVar('bru.runner.skipRequest', false);
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: '3'
                      type: http
                      seq: 3
                    http:
                      method: POST
                      url: https://echo.usebruno.com
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
              - info:
                  name: send-request
                  type: folder
                  seq: 16
                request:
                  auth: inherit
                items:
                  - info:
                      name: get-url-string
                      type: http
                      seq: 1
                    http:
                      method: POST
                      url: https://echo.usebruno.com
                      auth: inherit
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            await test("send request with a get url string", async () => {
                              const res = await bru.sendRequest("https://testbench-sanity.usebruno.com/ping");
                              expect(res.data).to.eql('pong');
                            });
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: usage-patterns
                      type: http
                      seq: 1
                    http:
                      method: POST
                      url: https://echo.usebruno.com
                      auth: inherit
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            // pattern 1: using async/await
                            await test("post request with async/await - success case", async () => {
                              const res = await bru.sendRequest({
                                url: 'https://echo.usebruno.com',
                                method: 'POST',
                                data: 'ping'
                              });
                              expect(res.data).to.eql('ping');
                            });

                            await test("post request with async/await - error case", async () => {
                              try {
                                await bru.sendRequest({
                                  url: 'https://echo.usebruno.com/invalid',
                                  method: 'POST',
                                  data: 'ping'
                                }); 
                              }
                              catch(err) {
                                expect(err.status).to.eql(404);
                              }
                            });

                            // pattern 2: using promise (.then/.catch)
                            await test("post request with promise chain - success case", async () => {
                              await bru.sendRequest({
                                url: 'https://echo.usebruno.com',
                                method: 'POST',
                                data: 'ping'
                              })
                              .then(res => {
                                expect(res.data).to.eql('ping');
                              });
                            });

                            await test("post request with promise chain - error case", async () => {
                              await bru.sendRequest({
                                url: 'https://echo.usebruno.com/invalid',
                                method: 'POST',
                                data: 'ping'
                              })
                              .catch(err => {
                                expect(err.status).to.eql(404);
                              });
                            });

                            // pattern 3: using callbacks
                            await test("post request with callback - success case", async () => {
                              await bru.sendRequest({
                                url: 'https://echo.usebruno.com',
                                method: 'POST',
                                data: 'ping'
                              }, function(error, response) {
                                expect(response.data).to.eql('ping');
                              });
                            });

                            await test("post request with callback - error case", async () => {
                              await bru.sendRequest({
                                url: 'https://echo.usebruno.com/invalid',
                                method: 'POST',
                                data: 'ping'
                              }, function(error, response) {
                                expect(error.status).to.eql(404);
                              });
                            });
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
              - info:
                  name: setCollectionVar
                  type: http
                  seq: 25
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // TODO: skipped because setCollectionVar does not update the UI
                        bru.runner.skipRequest();
                    - type: after-response
                      code: bru.setCollectionVar("testSetCollectionVar", "collection-test-value")
                    - type: tests
                      code: |-
                        test("should set collection var in scripts", function() {
                          const testSetCollectionVar = bru.getCollectionVar("testSetCollectionVar");
                          expect(testSetCollectionVar).to.equal("collection-test-value");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setEnvVar
                  type: http
                  seq: 3
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: after-response
                      code: bru.setEnvVar("testSetEnvVar", "bruno-29653")
                    - type: tests
                      code: |-
                        test("should set env var in scripts", function() {
                          const testSetEnvVar = bru.getEnvVar("testSetEnvVar")
                          expect(testSetEnvVar).to.equal("bruno-29653");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setVar
                  type: http
                  seq: 4
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: after-response
                      code: bru.setVar("testSetVar", "bruno-test-87267")
                    - type: tests
                      code: |-
                        test("should get var in scripts", function() {
                          const testSetVar = bru.getVar("testSetVar");
                          expect(testSetVar).to.equal("bruno-test-87267");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: req
              type: folder
            items:
              - info:
                  name: deleteHeader
                  type: http
                  seq: 12
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: bruno
                      value: is-awesome
                runtime:
                  scripts:
                    - type: before-request
                      code: req.deleteHeader('bruno');
                    - type: tests
                      code: |-
                        test("req.deleteHeader(name)", function() {
                          const h = req.getHeader('bruno');
                          expect(h).to.be.undefined;
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: deleteHeaders
                  type: http
                  seq: 13
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: X-Frame-Options
                      value: '1'
                    - name: Content-Type
                      value: application/json
                runtime:
                  scripts:
                    - type: before-request
                      code: req.deleteHeaders(['X-Frame-Options']);
                    - type: tests
                      code: |-
                        test("req.deleteHeaders(names)", function() {
                          const h = req.getHeaders();
                          expect(h["x-frame-options"]).to.be.undefined;
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getBody
                  type: http
                  seq: 9
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getBody()", function() {
                          const data = res.getBody();
                          expect(data).to.eql({
                            "hello": "bruno"
                          });
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getHeader
                  type: http
                  seq: 5
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: bruno
                      value: is-awesome
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getHeader(name)", function() {
                          const h = req.getHeader('bruno');
                          expect(h).to.equal("is-awesome");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getHeaders
                  type: http
                  seq: 7
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: bruno
                      value: is-awesome
                    - name: della
                      value: is-beautiful
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getHeaders()", function() {
                          const h = req.getHeaders();
                          expect(h.bruno).to.equal("is-awesome");
                          expect(h.della).to.equal("is-beautiful");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getHost
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getHost()", function() {
                          const host = req.getHost();
                          expect(host).to.equal("testbench-sanity.usebruno.com");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getMethod
                  type: http
                  seq: 3
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getMethod()()", function() {
                          const method = req.getMethod();
                          expect(method).to.equal("GET");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getName
                  type: http
                  seq: 11
                http:
                  method: GET
                  url: '{{host}}/ping'
                  auth: inherit
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("Check if request name is getName", function () {
                            expect(req.getName()).to.eql("getName");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getPath
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/api/users/123'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getPath()", function() {
                          const path = req.getPath();
                          expect(path).to.equal("/api/users/123");
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getPathParam
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/:pathParam'
                  params:
                    - name: pathParam
                      value: ping
                      type: path
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getPathParams()", function() {
                          const pathParams = req.getPathParams();
                          expect(pathParams[0].name).to.equal('pathParam');
                          expect(pathParams[0].value).to.equal('ping');
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getQueryString
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping?page=1&limit=10&sort=desc'
                  params:
                    - name: page
                      value: '1'
                      type: query
                    - name: limit
                      value: '10'
                      type: query
                    - name: sort
                      value: desc
                      type: query
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getQueryString()", function() {
                          const queryString = req.getQueryString();
                          expect(queryString).to.equal("page=1&limit=10&sort=desc");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getTags
                  type: http
                  seq: 11
                  tags:
                    - api
                    - test
                    - tags
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        // Test getTags() function
                        const tags = req.getTags();
                        bru.setVar('request-tags', tags);
                    - type: tests
                      code: |-
                        test("req.getTags() should return array of tags", function() {
                          const tags = bru.getVar('request-tags');
                          expect(tags).to.be.an('array');
                          expect(tags).to.include('api');
                          expect(tags).to.include('test');
                          expect(tags).to.include('tags');
                          expect(tags.length).to.be.equal(3);
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getUrl
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("req.getUrl()", function() {
                          const url = req.getUrl();
                          expect(url).to.equal("https://testbench-sanity.usebruno.com/ping");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: headerList
                  type: folder
                request:
                  headers:
                    - name: x-disabled
                      value: folder-hidden-value
                      disabled: true
                    - name: x-folder-only-disabled
                      value: folder-only-hidden
                      disabled: true
                items:
                  - info:
                      name: add
                      type: http
                      seq: 5
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            req.headerList.add({ key: 'x-added', value: 'via-add' });
                            req.headerList.upsert({ key: 'x-upserted', value: 'via-upsert' });
                            req.headerList.upsert({ key: 'bruno', value: 'is-the-best' });
                        - type: tests
                          code: |-
                            test("req.headerList.add(item)", function() {
                              expect(req.getHeader('x-added')).to.equal('via-add');
                            });

                            test("req.headerList.upsert(item) - new header", function() {
                              expect(req.getHeader('x-upserted')).to.equal('via-upsert');
                            });

                            test("req.headerList.upsert(item) - overwrite existing", function() {
                              expect(req.getHeader('bruno')).to.equal('is-the-best');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: assimilate
                      type: http
                      seq: 9
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            req.headerList.assimilate([
                              { key: 'x-merged', value: 'merged-value' }
                            ]);
                        - type: tests
                          code: |-
                            test("req.headerList.assimilate(source) - merges without removing existing", function() {
                              expect(req.getHeader('bruno')).to.equal('is-awesome');
                              expect(req.getHeader('x-merged')).to.equal('merged-value');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: case-insensitive-write
                      type: http
                      seq: 12
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: X-Custom
                          value: original
                        - name: X-Remove-Me
                          value: bye
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            req.headerList.upsert({ key: 'x-custom', value: 'updated' });
                            req.headerList.remove('x-remove-me');
                        - type: tests
                          code: |-
                            test("upsert() replaces header case-insensitively", function() {
                              expect(req.headerList.get('x-custom')).to.equal('updated');
                              expect(req.getHeader('X-Custom')).to.be.undefined;
                              expect(req.getHeader('x-custom')).to.equal('updated');
                            });

                            test("remove() deletes header case-insensitively", function() {
                              expect(req.headerList.has('X-Remove-Me')).to.be.false;
                              expect(req.headerList.has('x-remove-me')).to.be.false;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: case-insensitive
                      type: http
                      seq: 11
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: X-Custom
                          value: test-value
                        - name: Authorization
                          value: Bearer token123
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.get() is case-insensitive", function() {
                              expect(req.headerList.get('x-custom')).to.equal('test-value');
                              expect(req.headerList.get('X-CUSTOM')).to.equal('test-value');
                              expect(req.headerList.get('X-Custom')).to.equal('test-value');
                            });

                            test("req.headerList.one() is case-insensitive", function() {
                              const header = req.headerList.one('x-custom');
                              expect(header).to.not.be.undefined;
                              expect(header.key).to.equal('X-Custom');
                              expect(header.value).to.equal('test-value');
                            });

                            test("req.headerList.has() is case-insensitive", function() {
                              expect(req.headerList.has('x-custom')).to.be.true;
                              expect(req.headerList.has('X-CUSTOM')).to.be.true;
                              expect(req.headerList.has('x-custom', 'test-value')).to.be.true;
                              expect(req.headerList.has('X-CUSTOM', 'wrong')).to.be.false;
                            });

                            test("req.headerList.indexOf() is case-insensitive with string", function() {
                              expect(req.headerList.indexOf('x-custom')).to.be.at.least(0);
                              expect(req.headerList.indexOf('X-CUSTOM')).to.be.at.least(0);
                              expect(req.headerList.indexOf('nonexistent')).to.equal(-1);
                            });

                            test("req.headerList.indexOf() is case-insensitive with object", function() {
                              const idx = req.headerList.indexOf({ key: 'x-custom', value: 'test-value' });
                              expect(idx).to.be.at.least(0);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: clear
                      type: http
                      seq: 7
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                    runtime:
                      scripts:
                        - type: before-request
                          code: req.headerList.clear();
                        - type: tests
                          code: |-
                            test("req.headerList.clear() removes user-defined headers", function() {
                              expect(req.headerList.has('bruno')).to.be.false;
                              expect(req.headerList.has('della')).to.be.false;
                              expect(req.getHeaders()['bruno']).to.be.undefined;
                              expect(req.getHeaders()['della']).to.be.undefined;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: context-binding
                      type: http
                      seq: 13
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                        - name: x-custom
                          value: test-value
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("each(fn, context) binds this", function() {
                              var ctx = { keys: [] };
                              req.headerList.each(function(h) {
                                this.keys.push(h.key);
                              }, ctx);
                              expect(ctx.keys).to.include('bruno');
                              expect(ctx.keys).to.include('della');
                            });

                            test("filter(fn, context) binds this", function() {
                              var ctx = { target: 'bruno' };
                              var result = req.headerList.filter(function(h) {
                                return h.key === this.target;
                              }, ctx);
                              expect(result.length).to.equal(1);
                              expect(result[0].value).to.equal('is-awesome');
                            });

                            test("find(fn, context) binds this", function() {
                              var ctx = { target: 'della' };
                              var result = req.headerList.find(function(h) {
                                return h.key === this.target;
                              }, ctx);
                              expect(result).to.not.be.undefined;
                              expect(result.value).to.equal('is-beautiful');
                            });

                            test("map(fn, context) binds this", function() {
                              var ctx = { prefix: 'header-' };
                              var result = req.headerList.map(function(h) {
                                return this.prefix + h.key;
                              }, ctx);
                              expect(result).to.include('header-bruno');
                              expect(result).to.include('header-della');
                            });

                            test("reduce(fn, accumulator, context) binds this", function() {
                              var ctx = { sep: ', ' };
                              var result = req.headerList.reduce(function(acc, h) {
                                return acc ? acc + this.sep + h.key : h.key;
                              }, '', ctx);
                              expect(result).to.include('bruno');
                              expect(result).to.include('della');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: disabled-headers
                      type: http
                      seq: 10
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                        - name: x-disabled
                          value: hidden-value
                          disabled: true
                        - name: x-another-disabled
                          value: another-hidden
                          disabled: true
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.all() includes disabled headers", function() {
                              const all = req.headerList.all();
                              const keys = all.map(h => h.key);
                              expect(keys).to.include('x-disabled');
                              expect(keys).to.include('x-another-disabled');
                            });

                            test("disabled headers have disabled: true", function() {
                              const disabledHeader = req.headerList.find(h => h.key === 'x-disabled');
                              expect(disabledHeader).to.not.be.undefined;
                              expect(disabledHeader.disabled).to.be.true;
                              expect(disabledHeader.value).to.equal('hidden-value');
                            });

                            test("enabled headers do not have disabled property", function() {
                              const enabledHeader = req.headerList.find(h => h.key === 'bruno');
                              expect(enabledHeader).to.not.be.undefined;
                              expect(enabledHeader.disabled).to.be.undefined;
                            });

                            test("req.headerList.count() includes disabled headers", function() {
                              const count = req.headerList.count();
                              const all = req.headerList.all();
                              const brunoHeaders = all.filter(h => ['bruno', 'della', 'x-disabled', 'x-another-disabled', 'x-folder-only-disabled'].includes(h.key));
                              expect(brunoHeaders.length).to.equal(5);
                              expect(count).to.be.at.least(5);
                            });

                            test("req.headerList.filter() can separate enabled from disabled", function() {
                              const disabled = req.headerList.filter(h => h.disabled);
                              expect(disabled.length).to.equal(3);
                              const disabledKeys = disabled.map(h => h.key);
                              expect(disabledKeys).to.include('x-disabled');
                              expect(disabledKeys).to.include('x-another-disabled');
                              expect(disabledKeys).to.include('x-folder-only-disabled');
                            });

                            test("req.headerList.has() finds disabled headers", function() {
                              expect(req.headerList.has('x-disabled')).to.be.true;
                              expect(req.headerList.has('x-disabled', 'hidden-value')).to.be.true;
                            });

                            test("req.headerList.get() returns disabled header value", function() {
                              expect(req.headerList.get('x-disabled')).to.equal('hidden-value');
                            });

                            test("disabled headers are not in req.headers (raw object)", function() {
                              const rawHeaders = req.getHeaders();
                              expect(rawHeaders['x-disabled']).to.be.undefined;
                              expect(rawHeaders['x-another-disabled']).to.be.undefined;
                            });

                            test("enabled headers are still in req.headers (raw object)", function() {
                              const rawHeaders = req.getHeaders();
                              expect(rawHeaders['bruno']).to.equal('is-awesome');
                              expect(rawHeaders['della']).to.equal('is-beautiful');
                            });

                            test("folder-level disabled headers are inherited", function() {
                              expect(req.headerList.has('x-folder-only-disabled')).to.be.true;
                              const header = req.headerList.one('x-folder-only-disabled');
                              expect(header.disabled).to.be.true;
                              expect(header.value).to.equal('folder-only-hidden');
                            });

                            test("request-level disabled header overrides folder-level (no duplicates)", function() {
                              const all = req.headerList.all();
                              const matches = all.filter(h => h.key === 'x-disabled');
                              expect(matches.length).to.equal(1);
                              expect(matches[0].value).to.equal('hidden-value');
                              expect(matches[0].disabled).to.be.true;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: iteration-methods
                      type: http
                      seq: 3
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.each(fn)", function() {
                              const keys = [];
                              req.headerList.each((header) => {
                                keys.push(header.key);
                              });
                              expect(keys).to.include('bruno');
                              expect(keys).to.include('della');
                            });

                            test("req.headerList.map(fn)", function() {
                              const values = req.headerList.map(h => h.value);
                              expect(values).to.be.an('array');
                              expect(values).to.include('is-awesome');
                              expect(values).to.include('is-beautiful');
                            });

                            test("req.headerList.reduce(fn, initial)", function() {
                              const result = req.headerList.reduce((acc, h) => {
                                acc[h.key] = h.value;
                                return acc;
                              }, {});
                              expect(result.bruno).to.equal('is-awesome');
                              expect(result.della).to.equal('is-beautiful');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: populate
                      type: http
                      seq: 8
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            req.headerList.populate([
                              { key: 'bruno', value: 'overwritten' },
                              { key: 'x-new-one', value: 'one' },
                              { key: 'x-new-two', value: 'two' }
                            ]);
                        - type: tests
                          code: |-
                            test("req.headerList.populate(items) - adds new headers, skips existing keys", function() {
                              // existing headers are preserved (not overwritten)
                              expect(req.getHeader('bruno')).to.equal('is-awesome');
                              expect(req.getHeader('della')).to.equal('is-beautiful');
                              // new headers are added
                              expect(req.getHeader('x-new-one')).to.equal('one');
                              expect(req.getHeader('x-new-two')).to.equal('two');
                              expect(req.headerList.has('x-new-one')).to.be.true;
                              expect(req.headerList.has('x-new-two')).to.be.true;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: read-methods
                      type: http
                      seq: 1
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                        - name: x-custom
                          value: test-value
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.get(name)", function() {
                              expect(req.headerList.get('bruno')).to.equal('is-awesome');
                              expect(req.headerList.get('della')).to.equal('is-beautiful');
                              expect(req.headerList.get('nonexistent')).to.be.undefined;
                            });

                            test("req.headerList.one(name)", function() {
                              const header = req.headerList.one('bruno');
                              expect(header).to.eql({ key: 'bruno', value: 'is-awesome' });
                              expect(req.headerList.one('nonexistent')).to.be.undefined;
                            });

                            test("req.headerList.all()", function() {
                              const all = req.headerList.all();
                              expect(all).to.be.an('array');
                              expect(all.length).to.be.at.least(3);
                              const keys = all.map(h => h.key);
                              expect(keys).to.include('bruno');
                              expect(keys).to.include('della');
                              expect(keys).to.include('x-custom');
                            });

                            test("req.headerList.count()", function() {
                              expect(req.headerList.count()).to.be.at.least(3);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: remove
                      type: http
                      seq: 6
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                        - name: x-custom
                          value: test-value
                        - name: x-extra
                          value: extra-value
                    runtime:
                      scripts:
                        - type: before-request
                          code: |-
                            req.headerList.remove('bruno');
                            req.headerList.remove(h => h.key === 'della');
                            req.headerList.remove({ key: 'x-custom', value: 'test-value' });
                        - type: tests
                          code: |-
                            test("req.headerList.remove(name) - by string", function() {
                              expect(req.getHeader('bruno')).to.be.undefined;
                            });

                            test("req.headerList.remove(predicate) - by function", function() {
                              expect(req.getHeader('della')).to.be.undefined;
                            });

                            test("req.headerList.remove(object) - by object", function() {
                              expect(req.getHeader('x-custom')).to.be.undefined;
                            });

                            test("req.headerList.remove does not affect other headers", function() {
                              expect(req.getHeader('x-extra')).to.equal('extra-value');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: search-methods
                      type: http
                      seq: 2
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                        - name: x-custom
                          value: test-value
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.has(name)", function() {
                              expect(req.headerList.has('bruno')).to.be.true;
                              expect(req.headerList.has('nonexistent')).to.be.false;
                            });

                            test("req.headerList.has(name, value)", function() {
                              expect(req.headerList.has('bruno', 'is-awesome')).to.be.true;
                              expect(req.headerList.has('bruno', 'wrong-value')).to.be.false;
                            });

                            test("req.headerList.find(predicate)", function() {
                              const found = req.headerList.find(h => h.key === 'della');
                              expect(found).to.eql({ key: 'della', value: 'is-beautiful' });
                              expect(req.headerList.find(h => h.key === 'nonexistent')).to.be.undefined;
                            });

                            test("req.headerList.filter(predicate)", function() {
                              const filtered = req.headerList.filter(h => h.key.startsWith('x-') && !h.disabled);
                              expect(filtered).to.be.an('array');
                              expect(filtered.length).to.equal(1);
                              expect(filtered[0].key).to.equal('x-custom');
                            });

                            test("req.headerList.indexOf(item)", function() {
                              const idx = req.headerList.indexOf({ key: 'bruno', value: 'is-awesome' });
                              expect(idx).to.be.at.least(0);
                              const notFound = req.headerList.indexOf({ key: 'nonexistent', value: 'nope' });
                              expect(notFound).to.equal(-1);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: transform-methods
                      type: http
                      seq: 4
                    http:
                      method: GET
                      url: '{{host}}/ping'
                      headers:
                        - name: bruno
                          value: is-awesome
                        - name: della
                          value: is-beautiful
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("req.headerList.toObject()", function() {
                              const obj = req.headerList.toObject();
                              expect(obj).to.be.an('object');
                              expect(obj.bruno).to.equal('is-awesome');
                              expect(obj.della).to.equal('is-beautiful');
                            });

                            test("req.headerList.toString()", function() {
                              const str = req.headerList.toString();
                              expect(str).to.be.a('string');
                              expect(str).to.include('bruno: is-awesome');
                              expect(str).to.include('della: is-beautiful');
                            });

                            test("req.headerList.toJSON()", function() {
                              const json = req.headerList.toJSON();
                              expect(json).to.be.an('array');
                              const brunoHeader = json.find(h => h.key === 'bruno');
                              expect(brunoHeader).to.eql({ key: 'bruno', value: 'is-awesome' });
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: eq
                          value: pong
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
              - info:
                  name: setBody
                  type: folder
                items:
                  - info:
                      name: form-urlencoded
                      type: folder
                      seq: 1
                    request:
                      auth: inherit
                    items:
                      - info:
                          name: array body
                          type: http
                          seq: 8
                        http:
                          method: POST
                          url: '{{echo-host}}'
                          body:
                            type: form-urlencoded
                            data: []
                          auth: inherit
                        runtime:
                          scripts:
                            - type: before-request
                              code: |-
                                req.setBody([
                                  {name: "empty", value: ""},
                                  {name: "null", value: null},
                                  {name: "undefined", value: undefined},
                                  {name: "zero", value: 0},
                                  {name: "false", value: false},
                                  {name: "", value: "empty_key"},
                                  {name: "key", value: "value1"},
                                  {name: "name", value: "bruno"},
                                  {name: "key", value: "value2"},
                                ]);
                            - type: tests
                              code: |-
                                test("req.setBody() with edge cases - request body", function() {
                                  const data = req.getBody();
                                  const expected = [
                                    "empty=",
                                    "null=",
                                    "undefined=",
                                    "zero=0",
                                    "false=false",
                                    "=empty_key",
                                    "key=value1",
                                    "name=bruno",
                                    "key=value2"
                                  ].join("&");
                                  
                                  expect(data).to.eql(expected);
                                });

                                test("req.setBody() with edge cases - response body", function() {
                                  const data = res.getBody();
                                  const expected = [
                                    "empty=",
                                    "null=",
                                    "undefined=",
                                    "zero=0",
                                    "false=false",
                                    "=empty_key",
                                    "key=value1",
                                    "name=bruno",
                                    "key=value2"
                                  ].join("&");
                                  
                                  expect(data).to.eql(expected);
                                });
                        settings:
                          encodeUrl: true
                          timeout: 0
                          followRedirects: true
                          maxRedirects: 5
                      - info:
                          name: content-type via setHeader
                          type: http
                          seq: 7
                        http:
                          method: POST
                          url: '{{echo-host}}'
                          auth: inherit
                        runtime:
                          scripts:
                            - type: before-request
                              code: |-
                                req.setHeader('content-type', 'application/x-www-form-urlencoded');
                                req.setBody([
                                  {name: "key", value: "value"},
                                  {name: "name", value: "bruno"}
                                ]);
                            - type: tests
                              code: |-
                                test("req.setBody() - request body", function() {
                                  const data = req.getBody();
                                  expect(data).to.eql("key=value&name=bruno");
                                });

                                test("req.setBody() - response body", function() {
                                  const data = res.getBody();
                                  expect(data).to.eql("key=value&name=bruno");
                                });

                                test("Content-Type header is set correctly", function() {
                                  const contentType = req.getHeader('content-type');
                                  expect(contentType).to.eql('application/x-www-form-urlencoded');
                                });
                        settings:
                          encodeUrl: true
                          timeout: 0
                          followRedirects: true
                          maxRedirects: 5
                      - info:
                          name: object body
                          type: http
                          seq: 1
                        http:
                          method: POST
                          url: '{{echo-host}}'
                          body:
                            type: form-urlencoded
                            data: []
                          auth: inherit
                        runtime:
                          scripts:
                            - type: before-request
                              code: |-
                                req.setBody({
                                  "key": "value with spaces",
                                  "name": "bruno",
                                  "array": ["test", "value"],
                                });
                            - type: tests
                              code: |-
                                // https://github.com/usebruno/bruno/issues/5813
                                test("req.setBody() with object - request body", function() {
                                  const data = req.getBody();
                                  expect(data).to.eql("key=value%20with%20spaces&name=bruno&array=test&array=value");
                                });

                                test("req.setBody() with object - response body", function() {
                                  const data = res.getBody();
                                  expect(data).to.eql("key=value%20with%20spaces&name=bruno&array=test&array=value");
                                });
                        settings:
                          encodeUrl: true
                          timeout: 0
                          followRedirects: true
                          maxRedirects: 5
                      - info:
                          name: string body
                          type: http
                          seq: 3
                        http:
                          method: POST
                          url: '{{echo-host}}'
                          body:
                            type: form-urlencoded
                            data: []
                          auth: inherit
                        runtime:
                          scripts:
                            - type: before-request
                              code: req.setBody("key=value&name=bruno");
                            - type: tests
                              code: |-
                                test("req.setBody() with string format - request body", function() {
                                  const data = req.getBody();
                                  expect(data).to.eql("key=value&name=bruno");
                                });

                                test("req.setBody() with string format - response body", function() {
                                  const data = res.getBody();
                                  expect(data).to.eql("key=value&name=bruno");
                                });
                        settings:
                          encodeUrl: true
                          timeout: 0
                          followRedirects: true
                          maxRedirects: 5
              - info:
                  name: setBody
                  type: http
                  seq: 10
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        req.setBody({
                          "bruno": "is awesome"
                        });
                    - type: tests
                      code: |-
                        test("req.setBody()", function() {
                          const data = res.getBody();
                          expect(data).to.eql({
                            "bruno": "is awesome"
                          });
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setHeader
                  type: http
                  seq: 6
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: bruno
                      value: is-awesome
                runtime:
                  scripts:
                    - type: before-request
                      code: req.setHeader('bruno', 'is-the-future');
                    - type: tests
                      code: |-
                        test("req.setHeader(name)", function() {
                          const h = req.getHeader('bruno');
                          expect(h).to.equal("is-the-future");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setHeaders
                  type: http
                  seq: 8
                http:
                  method: GET
                  url: '{{host}}/ping'
                  headers:
                    - name: bruno
                      value: is-awesome
                    - name: della
                      value: is-beautiful
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        req.setHeaders({
                          "content-type": "application/text",
                          "transaction-id": "foobar"
                        });
                    - type: tests
                      code: |-
                        test("req.setHeaders()", function() {
                          const h = req.getHeaders();
                          expect(h['content-type']).to.equal("application/text");
                          expect(h['transaction-id']).to.equal("foobar");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setMethod
                  type: http
                  seq: 4
                http:
                  method: POST
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: req.setMethod("GET");
                    - type: tests
                      code: |-
                        test("req.setMethod()()", function() {
                          const method = req.getMethod();
                          expect(method).to.equal("GET");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setUrl
                  type: http
                  seq: 2
                http:
                  method: GET
                  url: '{{host}}/ping/invalid'
                runtime:
                  scripts:
                    - type: before-request
                      code: req.setUrl("https://testbench-sanity.usebruno.com/ping");
                    - type: tests
                      code: |-
                        test("req.setUrl()", function() {
                          const url = req.getUrl();
                          expect(url).to.equal("https://testbench-sanity.usebruno.com/ping");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: res
              type: folder
            items:
              - info:
                  name: getBody
                  type: http
                  seq: 4
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getBody()", function() {
                          const data = res.getBody();
                          expect(data).to.eql({
                            "hello": "bruno"
                          });
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getHeader
                  type: http
                  seq: 2
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getHeader(name)", function() {
                          const server = res.getHeader('x-powered-by');
                          expect(server).to.eql('Express');
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getHeaders
                  type: http
                  seq: 3
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getHeaders(name)", function() {
                          const h = res.getHeaders();
                          expect(h['x-powered-by']).to.eql('Express');
                          expect(h['content-length']).to.eql('17');
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getResponseTime
                  type: http
                  seq: 5
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getResponseTime()", function() {
                          const responseTime = res.getResponseTime();
                          expect(typeof responseTime).to.eql("number");
                          expect(responseTime > 0).to.be.true;
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getSize
                  type: http
                  seq: 8
                http:
                  method: GET
                  url: https://www.httpfaker.org/api/random/json?size=1mb
                  params:
                    - name: size
                      value: 1mb
                      type: query
                  auth: inherit
                runtime:
                  scripts:
                    - type: after-response
                      code: console.log(res.getSize())
                    - type: tests
                      code: |-
                        test("test total size", function() {
                          const sizes = res.getSize();
                          expect(sizes.total).to.equal(sizes.header + sizes.body);
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getStatus
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getStatus()", function() {
                          const status = res.getStatus()
                          expect(status).to.equal(200);
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getStatusText
                  type: http
                  seq: 6
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.getStatusText()", function() {
                          const statusText = res.getStatusText()
                          expect(statusText).to.equal('OK');
                        });
                  assertions:
                    - expression: res.statusText
                      operator: eq
                      value: OK
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: getUrl
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("res.url", function() {
                          expect(res.url).to.equal("https://testbench-sanity.usebruno.com/ping");
                        });

                        test("res.getUrl()", function() {
                          const url = res.getUrl();
                          expect(url).to.equal("https://testbench-sanity.usebruno.com/ping");
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                    - expression: res.body
                      operator: eq
                      value: pong
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: headerList
                  type: folder
                items:
                  - info:
                      name: case-insensitive
                      type: http
                      seq: 6
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("res.headerList.get() is case-insensitive", function() {
                              expect(res.headerList.get('X-Powered-By')).to.equal('Express');
                              expect(res.headerList.get('x-powered-by')).to.equal('Express');
                              expect(res.headerList.get('X-POWERED-BY')).to.equal('Express');
                            });

                            test("res.headerList.one() is case-insensitive", function() {
                              var header = res.headerList.one('X-POWERED-BY');
                              expect(header).to.not.be.undefined;
                              expect(header.value).to.equal('Express');
                            });

                            test("res.headerList.has() is case-insensitive", function() {
                              expect(res.headerList.has('X-Powered-By')).to.be.true;
                              expect(res.headerList.has('x-powered-by')).to.be.true;
                              expect(res.headerList.has('X-POWERED-BY')).to.be.true;
                              expect(res.headerList.has('x-powered-by', 'Express')).to.be.true;
                              expect(res.headerList.has('X-POWERED-BY', 'wrong')).to.be.false;
                            });

                            test("res.headerList.indexOf() is case-insensitive with string", function() {
                              expect(res.headerList.indexOf('x-powered-by')).to.be.at.least(0);
                              expect(res.headerList.indexOf('X-POWERED-BY')).to.be.at.least(0);
                              expect(res.headerList.indexOf('nonexistent')).to.equal(-1);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: iteration-methods
                      type: http
                      seq: 3
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("res.headerList.each(fn)", function() {
                              const keys = [];
                              res.headerList.each((header) => {
                                keys.push(header.key);
                              });
                              expect(keys).to.include('x-powered-by');
                            });

                            test("res.headerList.map(fn)", function() {
                              const keys = res.headerList.map(h => h.key);
                              expect(keys).to.be.an('array');
                              expect(keys).to.include('x-powered-by');
                            });

                            test("res.headerList.reduce(fn, initial)", function() {
                              const obj = res.headerList.reduce((acc, h) => {
                                acc[h.key] = h.value;
                                return acc;
                              }, {});
                              expect(obj['x-powered-by']).to.equal('Express');
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: read-methods
                      type: http
                      seq: 1
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("res.headerList.get(name)", function() {
                              expect(res.headerList.get('x-powered-by')).to.equal('Express');
                              expect(res.headerList.get('nonexistent')).to.be.undefined;
                            });

                            test("res.headerList.one(name)", function() {
                              const header = res.headerList.one('x-powered-by');
                              expect(header).to.eql({ key: 'x-powered-by', value: 'Express' });
                              expect(res.headerList.one('nonexistent')).to.be.undefined;
                            });

                            test("res.headerList.all()", function() {
                              const all = res.headerList.all();
                              expect(all).to.be.an('array');
                              expect(all.length).to.be.at.least(1);
                              const keys = all.map(h => h.key);
                              expect(keys).to.include('x-powered-by');
                            });

                            test("res.headerList.count()", function() {
                              expect(res.headerList.count()).to.be.at.least(1);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: search-methods
                      type: http
                      seq: 2
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("res.headerList.has(name)", function() {
                              expect(res.headerList.has('x-powered-by')).to.be.true;
                              expect(res.headerList.has('nonexistent')).to.be.false;
                            });

                            test("res.headerList.has(name, value)", function() {
                              expect(res.headerList.has('x-powered-by', 'Express')).to.be.true;
                              expect(res.headerList.has('x-powered-by', 'wrong')).to.be.false;
                            });

                            test("res.headerList.find(predicate)", function() {
                              const found = res.headerList.find(h => h.key === 'x-powered-by');
                              expect(found).to.eql({ key: 'x-powered-by', value: 'Express' });
                              expect(res.headerList.find(h => h.key === 'nonexistent')).to.be.undefined;
                            });

                            test("res.headerList.filter(predicate)", function() {
                              const filtered = res.headerList.filter(h => h.key.startsWith('x-'));
                              expect(filtered).to.be.an('array');
                              expect(filtered.length).to.be.at.least(1);
                            });

                            test("res.headerList.indexOf(item)", function() {
                              const idx = res.headerList.indexOf({ key: 'x-powered-by', value: 'Express' });
                              expect(idx).to.be.at.least(0);
                              expect(res.headerList.indexOf({ key: 'nonexistent', value: 'nope' })).to.equal(-1);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: transform-methods
                      type: http
                      seq: 4
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: tests
                          code: |-
                            test("res.headerList.toObject()", function() {
                              const obj = res.headerList.toObject();
                              expect(obj).to.be.an('object');
                              expect(obj['x-powered-by']).to.equal('Express');
                            });

                            test("res.headerList.toString()", function() {
                              const str = res.headerList.toString();
                              expect(str).to.be.a('string');
                              expect(str).to.include('x-powered-by: Express');
                            });

                            test("res.headerList.toJSON()", function() {
                              const json = res.headerList.toJSON();
                              expect(json).to.be.an('array');
                              const header = json.find(h => h.key === 'x-powered-by');
                              expect(header).to.eql({ key: 'x-powered-by', value: 'Express' });
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
              - info:
                  name: jsonBody
                  type: http
                  seq: 9
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "hello": "bruno",
                        "data": {
                          "items": [
                            { "name": "first" },
                            { "name": "second" }
                          ]
                        },
                        "matrix": [[1, 2], [3, 4]],
                        "tags": ["api", "test"],
                        "some-key": "hyphenated",
                        "a.b": "dotted-key",
                        "nested": {
                          "x.y": { "z": "deep-dotted" }
                        },
                        "it's": "apostrophe-key",
                        "say \\"hi\\"": "quoted-key"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("jsonBody() - no args validates JSON body", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody();
                        });

                        test("jsonBody(object) - deep equality", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody({
                            "hello": "bruno",
                            "data": {
                              "items": [
                                { "name": "first" },
                                { "name": "second" }
                              ]
                            },
                            "matrix": [[1, 2], [3, 4]],
                            "tags": ["api", "test"],
                            "some-key": "hyphenated",
                            "a.b": "dotted-key",
                            "nested": {
                              "x.y": { "z": "deep-dotted" }
                            },
                            "it's": "apostrophe-key",
                            "say \\"hi\\"": "quoted-key"
                          });
                        });

                        test("jsonBody(path) - nested property exists", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("hello");
                          expect(body).to.have.jsonBody("data.items");
                        });

                        test("jsonBody(path, value) - nested property equals value", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("hello", "bruno");
                        });

                        test("jsonBody with bracket notation", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("data.items[0].name", "first");
                        });

                        // --- bracket notation and array access ---

                        test("bracket notation - access array element returns object", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("data.items[0]", { "name": "first" });
                          expect(body).to.have.jsonBody("data.items[1]", { "name": "second" });
                        });

                        test("bracket notation - access top-level array elements", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("tags[0]", "api");
                          expect(body).to.have.jsonBody("tags[1]", "test");
                        });

                        test("bracket notation - consecutive brackets for nested arrays", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("matrix[0][0]", 1);
                          expect(body).to.have.jsonBody("matrix[0][1]", 2);
                          expect(body).to.have.jsonBody("matrix[1][0]", 3);
                          expect(body).to.have.jsonBody("matrix[1][1]", 4);
                        });

                        test("bracket notation - access nested array as whole value", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("matrix[0]", [1, 2]);
                          expect(body).to.have.jsonBody("matrix[1]", [3, 4]);
                        });

                        test("bracket notation - out of bounds index is not found", function() {
                          const body = res.getBody();
                          expect(body).to.not.have.jsonBody("tags[5]");
                          expect(body).to.not.have.jsonBody("data.items[99]");
                        });

                        // --- edge cases: string bracket keys and keys with dots ---

                        test("quoted bracket notation - double quotes for string keys", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody('["some-key"]', "hyphenated");
                        });

                        test("quoted bracket notation - single quotes for string keys", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody("['some-key']", "hyphenated");
                        });

                        test("quoted bracket notation - keys containing dots", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody('["a.b"]', "dotted-key");
                        });

                        test("quoted bracket notation - nested path with dotted keys", function() {
                          const body = res.getBody();
                          expect(body).to.have.jsonBody('nested["x.y"].z', "deep-dotted");
                        });

                        test("quoted bracket notation - key containing the other quote type", function() {
                          const body = res.getBody();
                          // Key is: it's — use double quotes so the single quote is not a delimiter
                          expect(body).to.have.jsonBody("[\\"it's\\"]", "apostrophe-key");
                        });

                        test("quoted bracket notation - escaped quotes in key", function() {
                          const body = res.getBody();
                          // Key is: say "hi" — use escaped double quotes inside double-quoted bracket
                          expect(body).to.have.jsonBody('["say \\\\"hi\\\\""]', "quoted-key");
                        });

                        test("to.not.have.jsonBody(path) - negation for missing property", function() {
                          const body = res.getBody();
                          expect(body).to.not.have.jsonBody("nonexistent");
                        });

                        test("to.not.have.jsonBody(path, value) - negation for wrong value", function() {
                          const body = res.getBody();
                          expect(body).to.not.have.jsonBody("hello", "wrong");
                        });

                        test("to.not.have.jsonBody(object) - negation for deep inequality", function() {
                          const body = res.getBody();
                          expect(body).to.not.have.jsonBody({ "wrong": "data" });
                        });

                        // --- not.to.have.jsonBody ---

                        test("not.to.have.jsonBody(path) - negation for missing property", function() {
                          const body = res.getBody();
                          expect(body).not.to.have.jsonBody("nonexistent");
                        });

                        test("not.to.have.jsonBody(path, value) - negation for wrong value", function() {
                          const body = res.getBody();
                          expect(body).not.to.have.jsonBody("hello", "wrong");
                        });

                        test("not.to.have.jsonBody(object) - negation for deep inequality", function() {
                          const body = res.getBody();
                          expect(body).not.to.have.jsonBody({ "wrong": "data" });
                        });

                        test("not.to.have.jsonBody fails when body matches", function() {
                          const body = res.getBody();
                          let failed = false;
                          try {
                            expect(body).not.to.have.jsonBody("hello");
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        // --- to.have.not.jsonBody ---

                        test("to.have.not.jsonBody(path) - negation for missing property", function() {
                          const body = res.getBody();
                          expect(body).to.have.not.jsonBody("nonexistent");
                        });

                        test("to.have.not.jsonBody(path, value) - negation for wrong value", function() {
                          const body = res.getBody();
                          expect(body).to.have.not.jsonBody("hello", "wrong");
                        });

                        test("to.have.not.jsonBody(object) - negation for deep inequality", function() {
                          const body = res.getBody();
                          expect(body).to.have.not.jsonBody({ "wrong": "data" });
                        });

                        test("to.have.not.jsonBody fails when body matches", function() {
                          const body = res.getBody();
                          let failed = false;
                          try {
                            expect(body).to.have.not.jsonBody("hello");
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: jsonSchema
                  type: http
                  seq: 9
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "name": "John",
                        "age": 30,
                        "email": "john@example.com",
                        "status": "active",
                        "score": 95.5,
                        "isVerified": true,
                        "tags": ["developer", "tester"],
                        "address": {
                          "street": "123 Main St",
                          "city": "Springfield",
                          "zip": "62701"
                        },
                        "website": "https://example.com/john",
                        "createdAt": "2024-01-15T10:30:00Z",
                        "birthDate": "1994-05-20",
                        "loginTime": "10:30:00Z",
                        "ipv4": "192.168.1.1",
                        "ipv6": "::1",
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "encodedData": "SGVsbG8gV29ybGQ=",
                        "int32Val": 2147483647,
                        "int64Val": 2147483648,
                        "floatVal": 3.14,
                        "doubleVal": 1.7976931348623157e+308,
                        "duration": "P3Y6M4DT12H30M5S",
                        "hostname": "example.com",
                        "regexPattern": "^[a-z]+$",
                        "jsonPointer": "/foo/bar/0",
                        "uriRef": "/relative/path",
                        "uriTemplate": "https://example.com/{user}",
                        "invalidRegex": "[invalid",
                        "invalidUriTemplate": "https://example.com/{invalid"
                      }
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        // --- Passing validations ---

                        test("Basic object with properties and required", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              age: { type: 'number' },
                              email: { type: 'string' },
                              status: { type: 'string' },
                              score: { type: 'number' },
                              isVerified: { type: 'boolean' },
                              tags: { type: 'array' },
                              address: { type: 'object' }
                            },
                            required: ['name', 'age', 'email']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("Nested object validation", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              address: {
                                type: 'object',
                                properties: {
                                  street: { type: 'string' },
                                  city: { type: 'string' },
                                  zip: { type: 'string' }
                                },
                                required: ['street', 'city', 'zip']
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("Array items validation", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              tags: {
                                type: 'array',
                                items: { type: 'string' }
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("String pattern (regex)", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: {
                                type: 'string',
                                pattern: '^[^@]+@[^@]+\\\\.[^@]+$'
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("Enum validation", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              status: {
                                type: 'string',
                                enum: ['active', 'inactive', 'pending']
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("Number range (minimum/maximum)", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              age: {
                                type: 'number',
                                minimum: 0,
                                maximum: 150
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("String length constraints (minLength/maxLength)", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 100
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("allOf composition", function() {
                          const schema = {
                            allOf: [
                              {
                                type: 'object',
                                properties: { name: { type: 'string' } },
                                required: ['name']
                              },
                              {
                                type: 'object',
                                properties: { age: { type: 'number' } },
                                required: ['age']
                              }
                            ]
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("anyOf composition", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              score: {
                                anyOf: [
                                  { type: 'number' },
                                  { type: 'string' }
                                ]
                              }
                            }
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("jsonSchema with ajvOptions - allErrors", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              age: { type: 'number' }
                            },
                            required: ['name', 'age']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema, { allErrors: true });
                        });

                        test("jsonSchema with ajvOptions - format validation with allErrors", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: { type: 'string', format: 'email' },
                              website: { type: 'string', format: 'uri' }
                            },
                            required: ['email', 'website']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema, { allErrors: true });
                        });

                        test("jsonSchema with ajvOptions - format rejection with allErrors", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'email' },
                              age: { type: 'string', format: 'uri' }
                            },
                            required: ['name', 'age']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema, { allErrors: true });
                        });

                        test("jsonSchema with ajvOptions - additionalProperties false", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string' }
                            },
                            additionalProperties: false
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema, { allErrors: true });
                        });

                        test("jsonSchema with ajvOptions - coerceTypes allows string as number", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              zip: { type: 'integer' }
                            },
                            required: ['zip']
                          };
                          // zip is "62701" (string) - fails without coercion
                          expect(res.getBody().address).to.not.have.jsonSchema(schema);
                          // passes with coerceTypes since "62701" can be coerced to integer
                          expect(res.getBody().address).to.have.jsonSchema(schema, { coerceTypes: true });
                        });

                        test("jsonSchema with ajvOptions - coerceTypes allows number as string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              age: { type: 'string' }
                            },
                            required: ['age']
                          };
                          // age is 30 (number) - fails without coercion
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                          // passes with coerceTypes since 30 can be coerced to "30"
                          expect(res.getBody()).to.have.jsonSchema(schema, { coerceTypes: true });
                        });

                        test("jsonSchema with ajvOptions - strict false allows unknown keywords", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', customKeyword: true }
                            },
                            required: ['name']
                          };
                          // unknown keyword "customKeyword" throws in strict mode (default)
                          expect(() => expect(res.getBody()).to.have.jsonSchema(schema)).to.throw('JSON schema compile error');
                          // passes with strict: false
                          expect(res.getBody()).to.have.jsonSchema(schema, { strict: false });
                        });

                        // --- ajv-formats: Passing validations ---

                        test("format: email - valid email", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: { type: 'string', format: 'email' }
                            },
                            required: ['email']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: uri - valid URI", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              website: { type: 'string', format: 'uri' }
                            },
                            required: ['website']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: date-time - valid ISO 8601 date-time", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              createdAt: { type: 'string', format: 'date-time' }
                            },
                            required: ['createdAt']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: date - valid date", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              birthDate: { type: 'string', format: 'date' }
                            },
                            required: ['birthDate']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: time - valid time", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              loginTime: { type: 'string', format: 'time' }
                            },
                            required: ['loginTime']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: ipv4 - valid IPv4 address", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              ipv4: { type: 'string', format: 'ipv4' }
                            },
                            required: ['ipv4']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: ipv6 - valid IPv6 address", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              ipv6: { type: 'string', format: 'ipv6' }
                            },
                            required: ['ipv6']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: uuid - valid UUID", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' }
                            },
                            required: ['id']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: byte - valid base64 string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              encodedData: { type: 'string', format: 'byte' }
                            },
                            required: ['encodedData']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: int32 - valid 32-bit integer", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              int32Val: { type: 'integer', format: 'int32' }
                            },
                            required: ['int32Val']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: int64 - valid 64-bit integer", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              int64Val: { type: 'integer', format: 'int64' }
                            },
                            required: ['int64Val']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: float - valid float", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              floatVal: { type: 'number', format: 'float' }
                            },
                            required: ['floatVal']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: double - valid double", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              doubleVal: { type: 'number', format: 'double' }
                            },
                            required: ['doubleVal']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: duration - valid ISO 8601 duration", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              duration: { type: 'string', format: 'duration' }
                            },
                            required: ['duration']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: hostname - valid hostname", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              hostname: { type: 'string', format: 'hostname' }
                            },
                            required: ['hostname']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: regex - valid regex pattern", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              regexPattern: { type: 'string', format: 'regex' }
                            },
                            required: ['regexPattern']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: json-pointer - valid JSON pointer", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              jsonPointer: { type: 'string', format: 'json-pointer' }
                            },
                            required: ['jsonPointer']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: uri-reference - valid URI reference", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              uriRef: { type: 'string', format: 'uri-reference' }
                            },
                            required: ['uriRef']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("format: uri-template - valid URI template", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              uriTemplate: { type: 'string', format: 'uri-template' }
                            },
                            required: ['uriTemplate']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        test("Multiple formats in one schema", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: { type: 'string', format: 'email' },
                              website: { type: 'string', format: 'uri' },
                              createdAt: { type: 'string', format: 'date-time' },
                              ipv4: { type: 'string', format: 'ipv4' },
                              id: { type: 'string', format: 'uuid' },
                              encodedData: { type: 'string', format: 'byte' },
                              int32Val: { type: 'integer', format: 'int32' },
                              floatVal: { type: 'number', format: 'float' },
                              duration: { type: 'string', format: 'duration' },
                              hostname: { type: 'string', format: 'hostname' }
                            },
                            required: ['email', 'website', 'createdAt', 'ipv4', 'id', 'encodedData', 'int32Val', 'floatVal', 'duration', 'hostname']
                          };
                          expect(res.getBody()).to.have.jsonSchema(schema);
                        });

                        // --- ajv-formats: Failure validations ---

                        test("format: email - rejects non-email string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'email' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: uri - rejects non-URI string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'uri' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: date-time - rejects plain date string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              birthDate: { type: 'string', format: 'date-time' }
                            },
                            required: ['birthDate']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: ipv4 - rejects non-IP string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'ipv4' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: uuid - rejects non-UUID string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'uuid' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: byte - rejects non-base64 string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: { type: 'string', format: 'byte' }
                            },
                            required: ['email']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: int32 - rejects value exceeding 32-bit range", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              int64Val: { type: 'integer', format: 'int32' }
                            },
                            required: ['int64Val']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: float - rejects non-number field", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'number', format: 'float' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: duration - rejects non-duration string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'duration' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: hostname - rejects invalid hostname", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              email: { type: 'string', format: 'hostname' }
                            },
                            required: ['email']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: json-pointer - rejects non-pointer string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'json-pointer' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: date - rejects non-date string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'date' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: time - rejects non-time string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'time' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: ipv6 - rejects non-IPv6 string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string', format: 'ipv6' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: int64 - rejects non-integer field", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'integer', format: 'int64' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: double - rejects non-number field", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'number', format: 'double' }
                            },
                            required: ['name']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: regex - rejects invalid regex pattern", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              invalidRegex: { type: 'string', format: 'regex' }
                            },
                            required: ['invalidRegex']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: uri-reference - rejects invalid URI reference string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              invalidRegex: { type: 'string', format: 'uri-reference' }
                            },
                            required: ['invalidRegex']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test("format: uri-template - rejects invalid URI template string", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              invalidUriTemplate: { type: 'string', format: 'uri-template' }
                            },
                            required: ['invalidUriTemplate']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        // --- Failure validations ---

                        test("Type mismatch - schema expects array, response is object", function() {
                          const schema = { type: 'array' };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        test("Missing required field", function() {
                          const schema = {
                            type: 'object',
                            required: ['nonExistentField']
                          };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        test("additionalProperties false rejects extra fields", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: { type: 'string' }
                            },
                            additionalProperties: false
                          };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        test("Enum mismatch", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              status: {
                                type: 'string',
                                enum: ['deleted', 'archived']
                              }
                            },
                            required: ['status']
                          };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        test("Pattern mismatch - name does not match digits-only", function() {
                          const schema = {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                                pattern: '^[0-9]+$'
                              }
                            },
                            required: ['name']
                          };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        // --- Malformed schema (ajv.compile error) ---

                        test("Malformed schema - invalid type throws assertion error", function() {
                          const schema = { type: 'invalidType' };
                          expect(() => expect(res.getBody()).to.have.jsonSchema(schema)).to.throw('JSON schema compile error');
                        });

                        // --- .not (negation) validations ---

                        test(".not with mismatched type - body is object, not array", function() {
                          const schema = { type: 'array' };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test(".not with missing required field", function() {
                          const schema = {
                            type: 'object',
                            required: ['nonExistent']
                          };
                          expect(res.getBody()).to.not.have.jsonSchema(schema);
                        });

                        test(".not fails when schema actually matches", function() {
                          const schema = { type: 'object' };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.not.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        // --- not.to.have (negation) validations ---

                        test("not.to.have with mismatched type - body is object, not array", function() {
                          const schema = { type: 'array' };
                          expect(res.getBody()).not.to.have.jsonSchema(schema);
                        });

                        test("not.to.have with missing required field", function() {
                          const schema = {
                            type: 'object',
                            required: ['nonExistent']
                          };
                          expect(res.getBody()).not.to.have.jsonSchema(schema);
                        });

                        test("not.to.have fails when schema actually matches", function() {
                          const schema = { type: 'object' };
                          let failed = false;
                          try {
                            expect(res.getBody()).not.to.have.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });

                        // --- to.have.not (negation) validations ---

                        test("to.have.not with mismatched type - body is object, not array", function() {
                          const schema = { type: 'array' };
                          expect(res.getBody()).to.have.not.jsonSchema(schema);
                        });

                        test("to.have.not with missing required field", function() {
                          const schema = {
                            type: 'object',
                            required: ['nonExistent']
                          };
                          expect(res.getBody()).to.have.not.jsonSchema(schema);
                        });

                        test("to.have.not fails when schema actually matches", function() {
                          const schema = { type: 'object' };
                          let failed = false;
                          try {
                            expect(res.getBody()).to.have.not.jsonSchema(schema);
                          } catch (e) {
                            failed = true;
                          }
                          expect(failed).to.be.true;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: setBody
                  type: folder
                items:
                  - info:
                      name: array
                      type: http
                      seq: 6
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: |-
                            const obj = {
                              hello : "hello from post-res"
                            }
                            // Safe mode, Dev mode behaves differently, null is getting converted to undefined, although both have null in the response, tests with undefined fails in safe mode, this needs to be investigated,, undefined is not a valid JSON
                            res.setBody(["hello",1, null, undefined, true, obj])
                        - type: tests
                          code: |-
                            test("res.setBody(array)", function() {
                              const body = res.getBody();
                              expect(body.length).to.eql(6);
                              expect(body[0]).to.eql("hello")
                              expect(body[1]).to.eql(1)
                              expect(body[2]).to.be.null
                            // Safe mode, Dev mode behaves differently, null is getting converted to undefined, although both have null in the response, tests with undefined fails in safe mode, this needs to be investigated,, undefined is not a valid JSON
                              expect(body[3]).to.be.undefined;
                              expect(body[4]).to.eql(true)
                              expect(body[5].hello).to.eql("hello from post-res")
                              
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: boolean
                      type: http
                      seq: 7
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: res.setBody(true)
                        - type: tests
                          code: |-
                            test("res.setBody(boolean)", function() {
                              const body = res.getBody();
                              expect(body).to.be.true;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: isJson after setBody
                      type: http
                      seq: 2
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: 'res.setBody({ id: 1, name: "updated", nested: { key: "value" } });'
                        - type: tests
                          code: |-
                            test("res.body should be json after setBody with object", function() {
                              const body = res.getBody();
                              expect(body).to.be.json;
                              expect(body.id).to.eql(1);
                              expect(body.name).to.eql("updated");
                              expect(body.nested.key).to.eql("value");
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                        - expression: res.body
                          operator: isJson
                          value: ''
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: 'null'
                      type: http
                      seq: 6
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: res.setBody(null)
                        - type: tests
                          code: |-
                            test("res.setBody(null)", function() {
                              const body = res.getBody();
                              expect(body).to.be.null;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: number
                      type: http
                      seq: 3
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: res.setBody(2)
                        - type: tests
                          code: |-
                            test("res.setBody(number)", function() {
                              const body = res.getBody();
                              expect(body).to.eql(2);
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: object
                      type: http
                      seq: 1
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: |-
                            res.setBody({
                              hello : "hello from post-res"
                            })
                        - type: tests
                          code: |-
                            test("res.setBody(object)", function() {
                              const body = res.getBody();
                              expect(body.hello).to.eql("hello from post-res");
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: string
                      type: http
                      seq: 4
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: res.setBody("hello from post-res")
                        - type: tests
                          code: |-
                            test("res.setBody(string)", function() {
                              const body = res.getBody();
                              expect(body).to.eql("hello from post-res");
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
                  - info:
                      name: undefined
                      type: http
                      seq: 7
                    http:
                      method: POST
                      url: '{{host}}/api/echo/json'
                      body:
                        type: json
                        data: |-
                          {
                            "hello": "bruno"
                          }
                    runtime:
                      scripts:
                        - type: after-response
                          code: |-
                            // if undefined  is not passed to res.setBody() the test fails in only safe-mode, needs to check, undefined is not a valid JSON
                            // Safe mode, Dev mode behaves differently, null is getting converted to undefined, although both have null in the response, tests with undefined fails in safe mode, this needs to be investigated, undefined is not a valid JSON
                            res.setBody(undefined)
                        - type: tests
                          code: |-
                            test("res.setBody(undefined)", function() {
                              const body = res.getBody();
                            // Safe mode, Dev mode behaves differently, null is getting converted to undefined, although both have null in the response, tests with undefined fails in safe mode, this needs to be investigated, undefined is not a valid JSON
                              expect(body).to.be.undefined;
                            });
                      assertions:
                        - expression: res.status
                          operator: eq
                          value: '200'
                    settings:
                      encodeUrl: true
                      timeout: 0
                      followRedirects: true
                      maxRedirects: 5
      - info:
          name: inbuilt modules
          type: folder
        items:
          - info:
              name: axios
              type: folder
            items:
              - info:
                  name: axios-pre-req-script
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const axios = require("axios");

                        const url = "https://testbench-sanity.usebruno.com/api/echo/json";
                        const response = await axios.post(url, {
                          "hello": "bruno"
                        });

                        req.setHeader('Content-Type', 'application/json');
                        req.setBody(response.data);
                        req.setMethod("POST");
                        req.setUrl(url);
                    - type: tests
                      code: |-
                        test("req.getBody()", function() {
                          const data = res.getBody();
                          expect(data).to.eql({
                            "hello": "bruno"
                          });
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: cheerio
              type: folder
            items:
              - info:
                  name: cheerio
                  type: http
                  seq: 1
                http:
                  method: POST
                  url: https://echo.usebruno.com
                  body:
                    type: text
                    data: <h2 class="title">Hello Bruno!</h2>
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const cheerio = require('cheerio');

                        const $ = cheerio.load('<h2 class="title">Hello world</h2>');

                        $('h2.title').text('Hello pre-request!');
                        $('h2').addClass('welcome');

                        bru.setVar("cheerio-test-pre-request", $.html());
                    - type: after-response
                      code: |-
                        const cheerio = require('cheerio');

                        const $ = cheerio.load('<h2 class="title">Hello world</h2>');

                        $('h2.title').text('Hello post-response!');
                        $('h2').addClass('welcome');

                        bru.setVar("cheerio-test-post-response", $.html());
                    - type: tests
                      code: |-
                        const cheerio = require('cheerio');

                        test("cheerio html - from pre request script", function() {
                          const expected = '<html><head></head><body><h2 class="title welcome">Hello pre-request!</h2></body></html>';
                          const html = bru.getVar('cheerio-test-pre-request');
                          expect(html).to.eql(expected);
                        });

                        test("cheerio html - from post response script", function() {
                          const expected = '<html><head></head><body><h2 class="title welcome">Hello post-response!</h2></body></html>';
                          const html = bru.getVar('cheerio-test-post-response');
                          expect(html).to.eql(expected);
                        });

                        test("cheerio html - from tests", function() {
                          const expected = '<html><head></head><body><h2 class="title">Hello Bruno!</h2></body></html>';
                          const $ = cheerio.load(res.body);
                          expect($.html()).to.eql(expected);
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: crypto-js
              type: folder
            items:
              - info:
                  name: crypto-js-pre-request-script
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        test("crypto message", function() {
                          var CryptoJS = require("crypto-js");

                          // Encrypt
                          var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
                          
                          // Decrypt
                          var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
                          var originalText = bytes.toString(CryptoJS.enc.Utf8);
                          
                          expect(originalText).to.eql('my message');
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: crypto-utils
              type: folder
            items:
              - info:
                  name: getRandomValues
                  type: http
                  seq: 3
                http:
                  method: POST
                  url: https://echo.usebruno.com
                  auth: inherit
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        const { getRandomValuesFunction, isUint8Array } = require('./scripting/inbuilt modules/utils.js');

                        // check if Uint8Array work as expected
                        test("should get random values", function() {
                          const uint8Array = new Uint8Array(32).fill(0);
                          const randomValueUint8Array = getRandomValuesFunction(new Uint8Array(uint8Array));
                          
                          const isValueUint8Array = isUint8Array(randomValueUint8Array);
                          expect(isValueUint8Array).to.be.true;
                          
                          const plainArray = Array.from(randomValueUint8Array);
                          expect(plainArray).to.be.of.length(32);
                          
                          const ogPlainArray = Array.from(uint8Array);
                          expect(ogPlainArray).to.not.deep.eql(plainArray);
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
              - info:
                  name: randomBytes
                  type: http
                  seq: 4
                http:
                  method: POST
                  url: https://echo.usebruno.com
                  auth: inherit
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        const { randomBytesFunction, isUint8Array } = require('./scripting/inbuilt modules/utils.js');

                        test("should get random byte values", function() {
                          const randomValueUint8Array = randomBytesFunction(32);
                          
                          const isValueUint8Array = isUint8Array(randomValueUint8Array);
                          expect(isValueUint8Array).to.be.true;
                          
                          const plainArray = Array.from(randomValueUint8Array);
                          expect(plainArray).to.be.of.length(32);
                        });
                  assertions:
                    - expression: res.status
                      operator: eq
                      value: '200'
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: nanoid
              type: folder
            items:
              - info:
                  name: nanoid
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const { nanoid } = require("nanoid");
                         
                        bru.setVar("nanoid-test-id", nanoid());
                    - type: tests
                      code: |-
                        test("nanoid var", function() {
                          const id = bru.getVar('nanoid-test-id');
                          let isValidNanoid = /^[a-zA-Z0-9_-]{21}$/.test(id)
                          bru.setVar('nanoid-test-id', null);
                          expect(isValidNanoid).to.eql(true);
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: tv4
              type: folder
            items:
              - info:
                  name: tv4
                  type: http
                  seq: 1
                http:
                  method: POST
                  url: '{{host}}/api/echo/json'
                  body:
                    type: json
                    data: |-
                      {
                        "name": "John",
                        "age": 30
                      }
                  auth: inherit
                runtime:
                  scripts:
                    - type: tests
                      code: |-
                        const tv4 = require("tv4")

                        const schema = {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            age: { type: 'number' }
                          }
                        };

                        let responseData = res.getBody();

                        let isValid = tv4.validate(responseData, schema);

                        test("Response body matches expected schema", function () {
                            expect(isValid, tv4.error ? tv4.error.message : "").to.be.true;
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: uuid
              type: folder
            items:
              - info:
                  name: uuid
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        const { v4 } = require("uuid");
                         
                        bru.setVar("uuid-test-id", v4());
                    - type: tests
                      code: |-
                        test("uuid var", function() {
                          const id = bru.getVar('uuid-test-id');
                          let isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
                          bru.setVar('uuid-test-id', null);
                          expect(isValidUuid).to.eql(true);
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
          - info:
              name: xml2js
              type: folder
            items:
              - info:
                  name: xml2js
                  type: http
                  seq: 1
                http:
                  method: GET
                  url: '{{host}}/ping'
                runtime:
                  scripts:
                    - type: before-request
                      code: |-
                        var parseString = require('xml2js').parseString;
                        var xml = "<root>Hello xml2js - pre request!</root>"
                        parseString(xml, function (err, result) {
                           bru.setVar("xml2js-test-result-pre-request", result); 
                        });
                    - type: after-response
                      code: |-
                        var parseString = require('xml2js').parseString;
                        var xml = "<root>Hello xml2js - post response!</root>"
                        parseString(xml, function (err, result) {
                           bru.setVar("xml2js-test-result-post-response", result);
                        });
                    - type: tests
                      code: |-
                        var parseString = require('xml2js').parseString;

                        test("xml2js parseString in scripts - pre request", function() {
                          const expected = {
                            root: 'Hello xml2js - pre request!'
                          };
                          const result = bru.getVar('xml2js-test-result-pre-request');
                          expect(result).to.eql(expected);
                        });

                        test("xml2js parseString in scripts - post response", function() {
                          const expected = {
                            root: 'Hello xml2js - post response!'
                          };
                          const result = bru.getVar('xml2js-test-result-post-response');
                          expect(result).to.eql(expected);
                        });

                        test("xml2js parseString in tests", async function() {
                          var xml = "<root>Hello inside test!</root>"
                          const expected = {
                            root: 'Hello inside test!'
                          };
                          parseString(xml, function (err, result) {
                            expect(result).to.eql(expected);
                          });
                        });
                settings:
                  encodeUrl: true
                  timeout: 0
                  followRedirects: true
                  maxRedirects: 5
      - info:
          name: js
          type: folder
        request:
          headers:
            - name: folder-header
              value: folder-header-value
          scripts:
            - type: before-request
              code: |-
                // used by \`scripting/js/folder-collection script-tests\`
                const shouldTestFolderScripts = bru.getVar('should-test-folder-scripts');
                if(shouldTestFolderScripts) {
                 bru.setVar('folder-var-set-by-folder-script', 'folder-var-value-set-by-folder-script');
                }
            - type: tests
              code: |-
                // used by \`scripting/js/folder-collection script-tests\`
                const shouldTestFolderScripts = bru.getVar('should-test-folder-scripts');
                const folderVar = bru.getVar("folder-var-set-by-folder-script");
                if (shouldTestFolderScripts && folderVar) {
                  test("folder level test - should get the var that was set by the folder script", function() {
                    expect(folderVar).to.equal("folder-var-value-set-by-folder-script");
                  }); 
                  bru.setVar('folder-var-set-by-folder-script', null); 
                  bru.setVar('should-test-folder-scripts', null);
                }
        items:
          - info:
              name: data types - request vars
              type: http
              seq: 3
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "boolean": false,
                    "number_1": 1,
                    "number_2": 0,
                    "number_3": -1,
                    "string": "bruno",
                    "array": [1, 2, 3, 4, 5],
                    "object": {
                      "hello": "bruno"
                    },
                    "null": null
                  }
            runtime:
              assertions:
                - expression: req.body.boolean
                  operator: isBoolean
                  value: 'false'
                - expression: req.body.number_1
                  operator: isNumber
                  value: '1'
                - expression: req.body.undefined
                  operator: isUndefined
                  value: undefined
                - expression: req.body.string
                  operator: isString
                  value: bruno
                - expression: req.body.null
                  operator: isNull
                  value: 'null'
                - expression: req.body.array
                  operator: isArray
                  value: ''
                - expression: req.body.boolean
                  operator: eq
                  value: 'false'
                - expression: req.body.number_1
                  operator: eq
                  value: '1'
                - expression: req.body.undefined
                  operator: eq
                  value: undefined
                - expression: req.body.string
                  operator: eq
                  value: bruno
                - expression: req.body.null
                  operator: eq
                  value: 'null'
                - expression: req.body.number_2
                  operator: eq
                  value: '0'
                - expression: req.body.number_3
                  operator: eq
                  value: '-1'
                - expression: req.body.number_2
                  operator: isNumber
                  value: ''
                - expression: req.body.number_3
                  operator: isNumber
                  value: ''
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: data types
              type: http
              seq: 2
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "boolean": false,
                    "number": 1,
                    "string": "bruno",
                    "array": [1, 2, 3, 4, 5],
                    "object": {
                      "hello": "bruno"
                    },
                    "null": null
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const reqBody = req.getBody();

                    bru.setVar("dataTypeVarTest", {
                      ...reqBody,
                      "undefined": undefined
                    });
                - type: tests
                  code: |-
                    test("data types check via bru var", function() {
                      let v = bru.getVar("dataTypeVarTest");
                      v = {
                        ...v,
                        "undefined": undefined
                      };
                      expect(v).to.eql({
                        "boolean": false,
                        "number": 1,
                        "string": "bruno",
                        "array": [1, 2, 3, 4, 5],
                        "object": {
                          "hello": "bruno"
                        },
                        "null": null,
                        "undefined": undefined
                      })
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: folder-collection script-tests pre
              type: http
              seq: 4
            http:
              method: POST
              url: '{{echo-host}}'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    bru.setVar('should-test-collection-scripts', true);
                    bru.setVar('should-test-folder-scripts', true);
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: folder-collection script-tests
              type: http
              seq: 5
            http:
              method: POST
              url: '{{echo-host}}'
            runtime:
              scripts:
                - type: before-request
                  code: // do not delete - the collection/folder scripts/tests run during this request execution
                - type: tests
                  code: |-
                    const collectionHeader = req.getHeader("collection-header");
                    const folderHeader = req.getHeader("folder-header");

                    test("should get the header value set at collection level", function() {
                      expect(collectionHeader).to.equal("collection-header-value");
                    });

                    test("should get the header value set at folder level", function() {
                      expect(folderHeader).to.equal("folder-header-value");
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: setTimeout
              type: http
              seq: 1
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    bru.setVar("test-js-set-timeout", "");
                    await new Promise((resolve, reject) => {
                      setTimeout(() => {
                        bru.setVar("test-js-set-timeout", "bruno");
                        resolve();
                      }, 1000);
                    });

                    const v = bru.getVar("test-js-set-timeout");
                    bru.setVar("test-js-set-timeout", v + "-is-awesome");
                - type: tests
                  code: |-
                    test("setTimeout()", function() {
                      const v = bru.getVar("test-js-set-timeout")
                      expect(v).to.eql("bruno-is-awesome");
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: local modules
          type: folder
        items:
          - info:
              name: additional context root
              type: http
              seq: 4
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "test": "additionalContextRoot"
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Load module from additionalContextRoot using relative path
                    // This tests that modules outside the collection can be loaded when configured in bruno.json
                    // The path "../additional-context-root-lib" is allowed because it's listed in additionalContextRoots
                    const additionalLib = require('../additional-context-root-lib');

                    // Verify all dependencies loaded correctly
                    const deps = additionalLib.verifyDependencies();
                    bru.setVar('fakerLoaded', deps.fakerLoaded);
                    bru.setVar('localModuleLoaded', deps.localModuleLoaded);

                    // Test the utility functions
                    const user = additionalLib.generateUser();
                    bru.setVar('hasFirstName', typeof user.firstName === 'string' && user.firstName.length > 0);
                    bru.setVar('hasLastName', typeof user.lastName === 'string' && user.lastName.length > 0);
                    bru.setVar('hasFullName', typeof user.fullName === 'string' && user.fullName.includes(' '));
                    bru.setVar('hasGreeting', typeof user.greeting === 'string' && user.greeting.startsWith('Hello, '));
                    bru.setVar('hasEmail', typeof user.email === 'string' && user.email.includes('@'));

                    // Test direct functions from local module
                    const formatted = additionalLib.formatName('John', 'Doe');
                    bru.setVar('formatNameResult', formatted);

                    const greeting = additionalLib.generateGreeting('Bruno');
                    bru.setVar('greetingResult', greeting);

                    // Test direct require of a specific file from additionalContextRoot
                    const libDirect = require('../additional-context-root-lib/lib.js');
                    bru.setVar('directRequireWorks', typeof libDirect.formatName === 'function');
                    bru.setVar('directFormatName', libDirect.formatName('Direct', 'Test'));
                    bru.setVar('directGreeting', libDirect.generateGreeting('World'));
                - type: tests
                  code: |-
                    test("should load module from additionalContextRoot", function() {
                      expect(bru.getVar('fakerLoaded')).to.equal(true);
                      expect(bru.getVar('localModuleLoaded')).to.equal(true);
                    });

                    test("should resolve npm module (@faker-js/faker) from collection node_modules", function() {
                      expect(bru.getVar('hasFirstName')).to.equal(true);
                      expect(bru.getVar('hasLastName')).to.equal(true);
                      expect(bru.getVar('hasEmail')).to.equal(true);
                    });

                    test("should resolve local module (./lib.js) relative to additionalContextRoot", function() {
                      expect(bru.getVar('hasFullName')).to.equal(true);
                      expect(bru.getVar('hasGreeting')).to.equal(true);
                    });

                    test("should correctly execute local module functions", function() {
                      expect(bru.getVar('formatNameResult')).to.equal('John Doe');
                      expect(bru.getVar('greetingResult')).to.equal('Hello, Bruno!');
                    });

                    test("should directly require specific file from additionalContextRoot", function() {
                      expect(bru.getVar('directRequireWorks')).to.equal(true);
                      expect(bru.getVar('directFormatName')).to.equal('Direct Test');
                      expect(bru.getVar('directGreeting')).to.equal('Hello, World!');
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: invalid and valid module imports
              type: http
              seq: 3
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    try {
                      bru.setVar('invalid_module_error_thrown', false);
                      // should throw an error
                      const invalid = require("./lib/invalid");
                    }
                    catch(error) {
                      bru.setVar('invalid_module_error_thrown', true);
                    }


                    try {
                      bru.setVar('valid_module_no_error', true);
                      // should not throw an error
                      const math = require("./lib/math");
                    }
                    catch(error) {
                      bru.setVar('valid_module_no_error', false);
                    }
              assertions:
                - expression: invalid_module_error_thrown
                  operator: eq
                  value: 'true'
                - expression: valid_module_no_error
                  operator: eq
                  value: 'true'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: sum (without js extn)
              type: http
              seq: 2
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "a": 1,
                    "b": 2
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const math = require("./lib/math");
                    console.log(math, 'math');

                    const body = req.getBody();
                    body.sum = math.sum(body.a, body.b);
                    body.areaOfCircle = math.areaOfCircle(2);

                    req.setBody(body);
                - type: tests
                  code: |-
                    test("should return json", function() {
                      const data = res.getBody();
                      expect(res.getBody()).to.eql({
                        "a": 1,
                        "b": 2,
                        "sum": 3,
                        "areaOfCircle": 12.56
                      });
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: sum
              type: http
              seq: 1
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "a": 1,
                    "b": 2
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const math = require("./lib/math.js");  
                    const body = req.getBody();
                    body.sum = math.sum(body.a, body.b);

                    req.setBody(body);
                - type: tests
                  code: |-
                    test("should return json", function() {
                      const data = res.getBody();
                      expect(res.getBody()).to.eql({
                        "a": 1,
                        "b": 2,
                        "sum": 3
                      });
                    });

                    test("should return json", function() {
                      const data = res.getBody();
                      expect(res.getBody()).to.eql({
                        "a": 1,
                        "b": 2,
                        "sum": 3
                      });
                    });

                    test("should return json", function() {
                      const data = res.getBody();
                      expect(res.getBody()).to.eql({
                        "a": 1,
                        "b": 2,
                        "sum": 3
                      });
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: node-builtins
          type: folder
        items:
          - info:
              name: buffer
              type: http
              seq: 1
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("Buffer.from and toString", function() {
                      const buf = Buffer.from('hello bruno', 'utf8');
                      expect(buf.toString()).to.equal('hello bruno');
                      expect(buf.toString('base64')).to.equal('aGVsbG8gYnJ1bm8=');
                      expect(buf.toString('hex')).to.equal('68656c6c6f206272756e6f');
                      expect(buf.length).to.equal(11);
                    });

                    test("Buffer.from with base64 and hex", function() {
                      expect(Buffer.from('aGVsbG8=', 'base64').toString()).to.equal('hello');
                      expect(Buffer.from('68656c6c6f', 'hex').toString()).to.equal('hello');
                    });

                    test("Buffer.alloc", function() {
                      const buf = Buffer.alloc(10, 0);
                      expect(buf.length).to.equal(10);
                      expect(buf[0]).to.equal(0);
                    });

                    test("Buffer.concat", function() {
                      const result = Buffer.concat([Buffer.from('hello '), Buffer.from('world')]);
                      expect(result.toString()).to.equal('hello world');
                    });

                    test("Buffer.isBuffer", function() {
                      expect(Buffer.isBuffer(Buffer.from('test'))).to.equal(true);
                      expect(Buffer.isBuffer('string')).to.equal(false);
                      expect(Buffer.isBuffer(new Uint8Array(4))).to.equal(false);
                    });

                    test("Buffer.subarray", function() {
                      const buf = Buffer.from('hello bruno');
                      expect(buf.subarray(0, 5).toString()).to.equal('hello');
                      expect(buf.subarray(6).toString()).to.equal('bruno');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: encoding
              type: http
              seq: 3
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("TextEncoder", function() {
                      const encoder = new TextEncoder();
                      const encoded = encoder.encode('hello');
                      expect(encoded).to.be.instanceOf(Uint8Array);
                      expect(encoded.length).to.equal(5);
                      expect(encoded[0]).to.equal(104); // 'h'
                    });

                    test("TextDecoder", function() {
                      const decoder = new TextDecoder('utf-8');
                      const decoded = decoder.decode(new Uint8Array([104, 101, 108, 108, 111]));
                      expect(decoded).to.equal('hello');
                    });

                    test("TextDecoder with utf-16le", function() {
                      const decoder = new TextDecoder('utf-16le');
                      const decoded = decoder.decode(new Uint8Array([104, 0, 105, 0]));
                      expect(decoded).to.equal('hi');
                    });

                    test("btoa and atob", function() {
                      expect(btoa('hello bruno')).to.equal('aGVsbG8gYnJ1bm8=');
                      expect(atob('aGVsbG8gYnJ1bm8=')).to.equal('hello bruno');
                    });

                    test("base64 roundtrip with binary data", function() {
                      const binary = String.fromCharCode(0, 1, 255, 254);
                      const encoded = btoa(binary);
                      const decoded = atob(encoded);
                      expect(decoded.charCodeAt(0)).to.equal(0);
                      expect(decoded.charCodeAt(2)).to.equal(255);
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: events
              type: http
              seq: 20
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("Event, EventTarget, CustomEvent exist", function() {
                      expect(Event).to.be.a('function');
                      expect(EventTarget).to.be.a('function');
                      expect(CustomEvent).to.be.a('function');
                    });

                    test("Event properties", function() {
                      const event = new Event('click', { bubbles: true, cancelable: true });
                      expect(event.type).to.equal('click');
                      expect(event.bubbles).to.equal(true);
                      expect(event.cancelable).to.equal(true);
                    });

                    test("CustomEvent with detail", function() {
                      const event = new CustomEvent('custom', { detail: { foo: 'bar' } });
                      expect(event.type).to.equal('custom');
                      expect(event.detail).to.deep.equal({ foo: 'bar' });
                    });

                    test("EventTarget addEventListener and dispatchEvent", function() {
                      let eventFired = false;
                      let eventDetail = null;

                      const target = new EventTarget();
                      target.addEventListener('test', (e) => {
                        eventFired = true;
                        eventDetail = e.detail;
                      });
                      target.dispatchEvent(new CustomEvent('test', { detail: 'hello' }));

                      expect(eventFired).to.equal(true);
                      expect(eventDetail).to.equal('hello');
                    });

                    test("Multiple event listeners", function() {
                      let count = 0;
                      const target = new EventTarget();
                      target.addEventListener('inc', () => count++);
                      target.addEventListener('inc', () => count++);
                      target.dispatchEvent(new Event('inc'));

                      expect(count).to.equal(2);
                    });

                    test("removeEventListener", function() {
                      let removed = true;
                      const target = new EventTarget();
                      const handler = () => { removed = false; };
                      target.addEventListener('test', handler);
                      target.removeEventListener('test', handler);
                      target.dispatchEvent(new Event('test'));

                      expect(removed).to.equal(true);
                    });

                    test("addEventListener with once option", function() {
                      let onceCount = 0;
                      const target = new EventTarget();
                      target.addEventListener('test', () => onceCount++, { once: true });
                      target.dispatchEvent(new Event('test'));
                      target.dispatchEvent(new Event('test'));

                      expect(onceCount).to.equal(1);
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: fetch-api
              type: http
              seq: 9
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("Fetch API globals exist", function() {
                      expect(fetch).to.be.a('function');
                      expect(Request).to.be.a('function');
                      expect(Response).to.be.a('function');
                      expect(Headers).to.be.a('function');
                    });

                    test("Headers", function() {
                      const headers = new Headers();
                      headers.set('Content-Type', 'application/json');
                      headers.append('X-Custom', 'value');
                      expect(headers.get('Content-Type')).to.equal('application/json');
                      expect(headers.has('X-Custom')).to.equal(true);
                      expect(headers.has('Missing')).to.equal(false);
                    });

                    test("Request", function() {
                      const req = new Request('https://example.com/api', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      expect(req.url).to.equal('https://example.com/api');
                      expect(req.method).to.equal('POST');
                      expect(req.headers.get('Content-Type')).to.equal('application/json');
                    });

                    test("Response", function() {
                      const res = new Response('body', { status: 201, statusText: 'Created' });
                      expect(res.status).to.equal(201);
                      expect(res.statusText).to.equal('Created');
                      expect(res.ok).to.equal(true);
                    });

                    test("Response body methods exist", function() {
                      const res = new Response('test');
                      expect(res.json).to.be.a('function');
                      expect(res.text).to.be.a('function');
                      expect(res.arrayBuffer).to.be.a('function');
                      expect(res.blob).to.be.a('function');
                    });

                    test("AbortController", function() {
                      const controller = new AbortController();
                      expect(controller.signal.aborted).to.equal(false);
                      controller.abort();
                      expect(controller.signal.aborted).to.equal(true);
                    });

                    test("FormData", function() {
                      const fd = new FormData();
                      fd.append('field', 'value');
                      expect(fd.get('field')).to.equal('value');
                      expect(fd.has('field')).to.equal(true);
                    });

                    test("Blob", function() {
                      const blob = new Blob(['hello'], { type: 'text/plain' });
                      expect(blob.size).to.equal(5);
                      expect(blob.type).to.equal('text/plain');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: intl
              type: http
              seq: 10
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("Intl.DateTimeFormat", function() {
                      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      expect(formatter.format(new Date('2024-06-15'))).to.equal('June 15, 2024');
                    });

                    test("Intl.NumberFormat", function() {
                      const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
                      expect(currency.format(1234.56)).to.equal('$1,234.56');

                      const percent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 });
                      expect(percent.format(0.456)).to.equal('45.6%');
                    });

                    test("Intl.Collator", function() {
                      const collator = new Intl.Collator('en', { sensitivity: 'base' });
                      expect(collator.compare('a', 'A')).to.equal(0);
                      expect(collator.compare('a', 'b')).to.be.lessThan(0);
                    });

                    test("Intl.PluralRules", function() {
                      const rules = new Intl.PluralRules('en-US');
                      expect(rules.select(1)).to.equal('one');
                      expect(rules.select(5)).to.equal('other');
                    });

                    test("Intl.RelativeTimeFormat", function() {
                      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
                      expect(rtf.format(-1, 'day')).to.equal('yesterday');
                      expect(rtf.format(1, 'day')).to.equal('tomorrow');
                    });

                    test("Intl.ListFormat", function() {
                      const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
                      expect(formatter.format(['Apple', 'Banana', 'Cherry'])).to.equal('Apple, Banana, and Cherry');
                    });

                    test("Intl.DisplayNames", function() {
                      const regions = new Intl.DisplayNames(['en'], { type: 'region' });
                      expect(regions.of('US')).to.equal('United States');

                      const languages = new Intl.DisplayNames(['en'], { type: 'language' });
                      expect(languages.of('fr')).to.equal('French');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: json
              type: http
              seq: 19
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("JSON.stringify", function() {
                      expect(JSON.stringify({ a: 1 })).to.equal('{"a":1}');
                      expect(JSON.stringify([1, 2, 3])).to.equal('[1,2,3]');
                      expect(JSON.stringify('hello')).to.equal('"hello"');
                      expect(JSON.stringify(null)).to.equal('null');
                    });

                    test("JSON.stringify with replacer", function() {
                      const obj = { a: 1, b: 2, c: 3 };
                      expect(JSON.stringify(obj, ['a', 'c'])).to.equal('{"a":1,"c":3}');
                      expect(JSON.stringify(obj, (k, v) => k === 'b' ? undefined : v)).to.equal('{"a":1,"c":3}');
                    });

                    test("JSON.stringify with space", function() {
                      const obj = { a: 1 };
                      expect(JSON.stringify(obj, null, 2)).to.equal('{\\n  "a": 1\\n}');
                    });

                    test("JSON.parse", function() {
                      expect(JSON.parse('{"a":1}')).to.deep.equal({ a: 1 });
                      expect(JSON.parse('[1,2,3]')).to.deep.equal([1, 2, 3]);
                      expect(JSON.parse('"hello"')).to.equal('hello');
                      expect(JSON.parse('null')).to.equal(null);
                    });

                    test("JSON.parse with reviver", function() {
                      const result = JSON.parse('{"a":1,"b":2}', (k, v) => typeof v === 'number' ? v * 2 : v);
                      expect(result).to.deep.equal({ a: 2, b: 4 });
                    });

                    test("JSON roundtrip with complex object", function() {
                      const obj = {
                        string: 'hello',
                        number: 42,
                        float: 3.14,
                        boolean: true,
                        null: null,
                        array: [1, 2, 3],
                        nested: { a: { b: { c: 'deep' } } }
                      };
                      expect(JSON.parse(JSON.stringify(obj))).to.deep.equal(obj);
                    });

                    test("JSON.stringify handles special values", function() {
                      expect(JSON.stringify({ a: undefined })).to.equal('{}');
                      expect(JSON.stringify([undefined])).to.equal('[null]');
                      expect(JSON.stringify({ a: NaN })).to.equal('{"a":null}');
                      expect(JSON.stringify({ a: Infinity })).to.equal('{"a":null}');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-crypto
              type: http
              seq: 12
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const crypto = require('node:crypto');

                    test("crypto.randomBytes", function() {
                      const bytes = crypto.randomBytes(16);
                      expect(Buffer.isBuffer(bytes)).to.equal(true);
                      expect(bytes.length).to.equal(16);
                    });

                    test("crypto.randomUUID", function() {
                      const uuid = crypto.randomUUID();
                      expect(uuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
                    });

                    test("crypto.createHash", function() {
                      const md5 = crypto.createHash('md5').update('hello').digest('hex');
                      expect(md5).to.have.lengthOf(32);

                      const sha256 = crypto.createHash('sha256').update('hello').digest('hex');
                      expect(sha256).to.have.lengthOf(64);

                      const sha512 = crypto.createHash('sha512').update('hello').digest('hex');
                      expect(sha512).to.have.lengthOf(128);
                    });

                    test("crypto.createHmac", function() {
                      const hmac = crypto.createHmac('sha256', 'secret').update('hello').digest('hex');
                      expect(hmac).to.have.lengthOf(64);
                    });

                    test("crypto.getHashes and crypto.getCiphers", function() {
                      const hashes = crypto.getHashes();
                      expect(hashes).to.be.an('array').that.includes('sha256');

                      const ciphers = crypto.getCiphers();
                      expect(ciphers).to.be.an('array');
                      expect(ciphers.some(c => c.includes('aes'))).to.equal(true);
                    });

                    test("crypto.pbkdf2Sync", function() {
                      const key = crypto.pbkdf2Sync('password', 'salt', 1000, 32, 'sha256');
                      expect(key.length).to.equal(32);
                    });

                    test("crypto.scryptSync", function() {
                      const key = crypto.scryptSync('password', 'salt', 32);
                      expect(key.length).to.equal(32);
                    });

                    test("crypto.timingSafeEqual", function() {
                      const a = Buffer.from('hello');
                      const b = Buffer.from('hello');
                      const c = Buffer.from('world');
                      expect(crypto.timingSafeEqual(a, b)).to.equal(true);
                      expect(crypto.timingSafeEqual(a, c)).to.equal(false);
                    });

                    test("AES encryption/decryption", function() {
                      const key = crypto.randomBytes(32);
                      const iv = crypto.randomBytes(16);
                      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                      let encrypted = cipher.update('secret message', 'utf8', 'hex');
                      encrypted += cipher.final('hex');

                      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
                      decrypted += decipher.final('utf8');

                      expect(decrypted).to.equal('secret message');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-fs
              type: http
              seq: 13
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const fs = require('node:fs');
                    const path = require('node:path');
                    const os = require('node:os');

                    // Setup - create test directory and file
                    const testDir = path.join(os.tmpdir(), 'bruno-fs-test-' + Date.now());
                    const testFile = path.join(testDir, 'test.txt');
                    fs.mkdirSync(testDir, { recursive: true });
                    fs.writeFileSync(testFile, 'Hello Bruno!');

                    test("fs.existsSync", function() {
                      expect(fs.existsSync(testDir)).to.equal(true);
                      expect(fs.existsSync(testFile)).to.equal(true);
                      expect(fs.existsSync('/nonexistent')).to.equal(false);
                    });

                    test("fs.readFileSync", function() {
                      expect(fs.readFileSync(testFile, 'utf8')).to.equal('Hello Bruno!');
                      expect(Buffer.isBuffer(fs.readFileSync(testFile))).to.equal(true);
                    });

                    test("fs.appendFileSync", function() {
                      fs.appendFileSync(testFile, ' Appended.');
                      expect(fs.readFileSync(testFile, 'utf8')).to.equal('Hello Bruno! Appended.');
                    });

                    test("fs.statSync", function() {
                      const fileStat = fs.statSync(testFile);
                      expect(fileStat.isFile()).to.equal(true);
                      expect(fileStat.isDirectory()).to.equal(false);

                      const dirStat = fs.statSync(testDir);
                      expect(dirStat.isDirectory()).to.equal(true);
                    });

                    test("fs.readdirSync", function() {
                      const files = fs.readdirSync(testDir);
                      expect(files).to.include('test.txt');
                    });

                    test("fs.copyFileSync and fs.renameSync", function() {
                      const copyPath = path.join(testDir, 'copy.txt');
                      const renamePath = path.join(testDir, 'renamed.txt');

                      fs.copyFileSync(testFile, copyPath);
                      expect(fs.existsSync(copyPath)).to.equal(true);

                      fs.renameSync(copyPath, renamePath);
                      expect(fs.existsSync(copyPath)).to.equal(false);
                      expect(fs.existsSync(renamePath)).to.equal(true);

                      // Cleanup
                      fs.unlinkSync(renamePath);
                    });

                    // Cleanup
                    fs.unlinkSync(testFile);
                    fs.rmdirSync(testDir);
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-os
              type: http
              seq: 14
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const os = require('node:os');

                    test("os.platform and os.arch", function() {
                      expect(['darwin', 'linux', 'win32']).to.include(os.platform());
                      expect(['x64', 'arm64', 'arm', 'ia32']).to.include(os.arch());
                    });

                    test("os.type and os.release", function() {
                      expect(os.type()).to.be.a('string');
                      expect(os.release()).to.be.a('string');
                    });

                    test("os.hostname, os.homedir, os.tmpdir", function() {
                      expect(os.hostname()).to.be.a('string');
                      expect(os.homedir()).to.be.a('string').with.length.greaterThan(0);
                      expect(os.tmpdir()).to.be.a('string').with.length.greaterThan(0);
                    });

                    test("os.cpus", function() {
                      const cpus = os.cpus();
                      expect(cpus).to.be.an('array').with.length.greaterThan(0);
                      expect(cpus[0]).to.have.property('model');
                    });

                    test("os.totalmem and os.freemem", function() {
                      expect(os.totalmem()).to.be.a('number').greaterThan(0);
                      expect(os.freemem()).to.be.a('number').greaterThan(0);
                    });

                    test("os.uptime", function() {
                      expect(os.uptime()).to.be.a('number').greaterThan(0);
                    });

                    test("os.loadavg", function() {
                      const load = os.loadavg();
                      expect(load).to.be.an('array').with.lengthOf(3);
                    });

                    test("os.networkInterfaces", function() {
                      expect(os.networkInterfaces()).to.be.an('object');
                    });

                    test("os.userInfo", function() {
                      const info = os.userInfo();
                      expect(info.username).to.be.a('string');
                      expect(info.homedir).to.be.a('string');
                    });

                    test("os.EOL and os.constants", function() {
                      expect(['\\n', '\\r\\n']).to.include(os.EOL);
                      expect(os.constants).to.have.property('signals');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-path
              type: http
              seq: 11
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const path = require('node:path');

                    test("path.resolve", function() {
                      const resolved = path.resolve('foo', 'bar');
                      expect(path.isAbsolute(resolved)).to.equal(true);
                    });

                    test("path.dirname and path.basename", function() {
                      expect(path.basename('/foo/bar/baz.txt')).to.equal('baz.txt');
                      expect(path.basename('/foo/bar/baz.txt', '.txt')).to.equal('baz');
                    });

                    test("path.extname", function() {
                      expect(path.extname('file.txt')).to.equal('.txt');
                      expect(path.extname('file')).to.equal('');
                      expect(path.extname('.gitignore')).to.equal('');
                    });

                    test("path.parse and path.format", function() {
                      const parsed = path.parse('/foo/bar/baz.txt');
                      expect(parsed.base).to.equal('baz.txt');
                      expect(parsed.name).to.equal('baz');
                      expect(parsed.ext).to.equal('.txt');
                    });

                    test("path.isAbsolute", function() {
                      expect(path.isAbsolute('/foo/bar')).to.equal(true);
                      expect(path.isAbsolute('foo/bar')).to.equal(false);
                    });

                    test("path.sep and path.delimiter", function() {
                      expect(path.sep).to.be.a('string');
                      expect(path.delimiter).to.be.a('string');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-querystring
              type: http
              seq: 16
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const qs = require('node:querystring');

                    test("querystring.parse", function() {
                      const parsed = qs.parse('foo=1&bar=2&foo=3');
                      expect(parsed.bar).to.equal('2');
                      expect(parsed.foo).to.deep.equal(['1', '3']);
                    });

                    test("querystring.parse with custom separators", function() {
                      const parsed = qs.parse('foo:1;bar:2', ';', ':');
                      expect(parsed.foo).to.equal('1');
                      expect(parsed.bar).to.equal('2');
                    });

                    test("querystring.stringify", function() {
                      expect(qs.stringify({ foo: 'bar', baz: 'qux' })).to.equal('foo=bar&baz=qux');
                      expect(qs.stringify({ foo: ['a', 'b'] })).to.equal('foo=a&foo=b');
                    });

                    test("querystring.stringify with custom separators", function() {
                      expect(qs.stringify({ foo: 'bar', baz: 'qux' }, ';', ':')).to.equal('foo:bar;baz:qux');
                    });

                    test("querystring.escape and unescape", function() {
                      expect(qs.escape('hello world')).to.equal('hello%20world');
                      expect(qs.unescape('hello%20world')).to.equal('hello world');
                    });

                    test("querystring roundtrip", function() {
                      const obj = { name: 'Bruno', version: '1.0' };
                      const encoded = qs.stringify(obj);
                      const decoded = qs.parse(encoded);
                      expect(decoded.name).to.equal('Bruno');
                      expect(decoded.version).to.equal('1.0');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-stream
              type: http
              seq: 18
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const stream = require('node:stream');
                    const { Readable, Writable, Transform, Duplex, pipeline } = stream;

                    test("stream module exports", function() {
                      expect(stream.Readable).to.be.a('function');
                      expect(stream.Writable).to.be.a('function');
                      expect(stream.Transform).to.be.a('function');
                      expect(stream.Duplex).to.be.a('function');
                      expect(stream.pipeline).to.be.a('function');
                    });

                    test("Readable.from creates readable stream", function() {
                      const readable = Readable.from(['hello', ' ', 'bruno']);
                      expect(readable).to.be.an('object');
                      expect(readable.read).to.be.a('function');
                      expect(readable.on).to.be.a('function');
                    });

                    test("Writable stream can be created", function() {
                      const chunks = [];
                      const writable = new Writable({
                        write(chunk, enc, cb) { chunks.push(chunk); cb(); }
                      });
                      expect(writable).to.be.an('object');
                      expect(writable.write).to.be.a('function');
                      expect(writable.end).to.be.a('function');
                    });

                    test("Transform stream can be created", function() {
                      const transform = new Transform({
                        transform(chunk, enc, cb) { cb(null, chunk.toString().toUpperCase()); }
                      });
                      expect(transform).to.be.an('object');
                      expect(transform.write).to.be.a('function');
                      expect(transform.read).to.be.a('function');
                    });

                    test("Duplex stream can be created", function() {
                      const duplex = new Duplex({
                        read() {},
                        write(chunk, enc, cb) { cb(); }
                      });
                      expect(duplex).to.be.an('object');
                      expect(duplex.read).to.be.a('function');
                      expect(duplex.write).to.be.a('function');
                    });

                    test("pipeline is a function", function() {
                      expect(pipeline).to.be.a('function');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-util
              type: http
              seq: 15
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const util = require('node:util');

                    test("util.format", function() {
                      expect(util.format('Hello %s', 'Bruno')).to.equal('Hello Bruno');
                      expect(util.format('Count: %d', 42)).to.equal('Count: 42');
                      expect(util.format('Data: %j', { a: 1 })).to.equal('Data: {"a":1}');
                    });

                    test("util.inspect", function() {
                      const obj = { name: 'bruno', nested: { value: 42 } };
                      const str = util.inspect(obj);
                      expect(str).to.be.a('string').that.includes('bruno');

                      const deep = { a: { b: { c: { d: 'deep' } } } };
                      expect(util.inspect(deep, { depth: 1 })).to.include('[Object]');
                      expect(util.inspect(deep, { depth: null })).to.include('deep');
                    });

                    test("util.promisify", function() {
                      const promisified = util.promisify(setTimeout);
                      expect(promisified).to.be.a('function');
                      // Returns a promise when called
                      const result = promisified(1);
                      expect(result).to.be.a('promise');
                    });

                    test("util.types", function() {
                      expect(util.types.isDate(new Date())).to.equal(true);
                      expect(util.types.isMap(new Map())).to.equal(true);
                      expect(util.types.isSet(new Set())).to.equal(true);
                      expect(util.types.isRegExp(/test/)).to.equal(true);
                      expect(util.types.isPromise(Promise.resolve())).to.equal(true);
                    });

                    test("util.isDeepStrictEqual", function() {
                      expect(util.isDeepStrictEqual({ a: 1 }, { a: 1 })).to.equal(true);
                      expect(util.isDeepStrictEqual({ a: 1 }, { a: 2 })).to.equal(false);
                    });

                    test("util.deprecate and util.callbackify", function() {
                      expect(util.deprecate(() => {}, 'deprecated')).to.be.a('function');
                      expect(util.callbackify(async () => {})).to.be.a('function');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: node-zlib
              type: http
              seq: 17
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    const zlib = require('node:zlib');

                    const testData = Buffer.from('Hello Bruno! '.repeat(100));

                    test("gzip and gunzip", function() {
                      const compressed = zlib.gzipSync(testData);
                      expect(compressed.length).to.be.lessThan(testData.length);

                      const decompressed = zlib.gunzipSync(compressed);
                      expect(decompressed.toString()).to.equal(testData.toString());
                    });

                    test("deflate and inflate", function() {
                      const compressed = zlib.deflateSync(testData);
                      expect(compressed.length).to.be.lessThan(testData.length);

                      const decompressed = zlib.inflateSync(compressed);
                      expect(decompressed.toString()).to.equal(testData.toString());
                    });

                    test("deflateRaw and inflateRaw", function() {
                      const compressed = zlib.deflateRawSync(testData);
                      const decompressed = zlib.inflateRawSync(compressed);
                      expect(decompressed.toString()).to.equal(testData.toString());
                    });

                    test("brotli compression", function() {
                      const compressed = zlib.brotliCompressSync(testData);
                      expect(compressed.length).to.be.lessThan(testData.length);

                      const decompressed = zlib.brotliDecompressSync(compressed);
                      expect(decompressed.toString()).to.equal(testData.toString());
                    });

                    test("compression levels", function() {
                      const high = zlib.gzipSync(testData, { level: 9 });
                      const low = zlib.gzipSync(testData, { level: 1 });
                      expect(high.length).to.be.at.most(low.length);
                    });

                    test("zlib.constants", function() {
                      expect(zlib.constants).to.have.property('Z_BEST_COMPRESSION');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: process
              type: http
              seq: 6
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("process exists with expected properties", function() {
                      expect(typeof process).to.equal('object');
                      expect(process.version).to.match(/^v\\d+\\.\\d+\\.\\d+/);
                      expect(process.versions).to.have.property('node');
                      expect(process.versions).to.have.property('v8');
                    });

                    test("process.arch and process.platform", function() {
                      expect(['x64', 'arm64', 'arm', 'ia32']).to.include(process.arch);
                      expect(['darwin', 'linux', 'win32']).to.include(process.platform);
                    });

                    test("process.pid and process.title", function() {
                      expect(process.pid).to.be.a('number').and.to.be.greaterThan(0);
                      expect(process.title).to.be.a('string');
                    });

                    test("process.argv is array", function() {
                      expect(process.argv).to.be.an('array');
                    });

                    test("process.env is available", function() {
                      expect(process.env).to.be.an('object');
                    });

                    test("process.nextTick is available", function() {
                      expect(process.nextTick).to.be.a('function');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: timers
              type: http
              seq: 5
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("setTimeout exists and is callable", function() {
                      expect(setTimeout).to.be.a('function');
                      const id = setTimeout(() => {}, 1000);
                      expect(id).to.not.be.undefined;
                      clearTimeout(id);
                    });

                    test("clearTimeout exists and works", function() {
                      expect(clearTimeout).to.be.a('function');
                      let fired = false;
                      const id = setTimeout(() => { fired = true; }, 0);
                      clearTimeout(id);
                      // Can't fully verify without async, but clearTimeout should not throw
                      expect(fired).to.equal(false);
                    });

                    test("setInterval exists and is callable", function() {
                      expect(setInterval).to.be.a('function');
                      const id = setInterval(() => {}, 1000);
                      expect(id).to.not.be.undefined;
                      clearInterval(id);
                    });

                    test("clearInterval exists", function() {
                      expect(clearInterval).to.be.a('function');
                    });

                    test("setImmediate exists and is callable", function() {
                      expect(setImmediate).to.be.a('function');
                      const id = setImmediate(() => {});
                      expect(id).to.not.be.undefined;
                      clearImmediate(id);
                    });

                    test("clearImmediate exists", function() {
                      expect(clearImmediate).to.be.a('function');
                    });

                    test("queueMicrotask exists", function() {
                      expect(queueMicrotask).to.be.a('function');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: url
              type: http
              seq: 2
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("URL parsing", function() {
                      const url = new URL('https://user:pass@example.com:8080/path?foo=bar#hash');
                      expect(url.protocol).to.equal('https:');
                      expect(url.hostname).to.equal('example.com');
                      expect(url.port).to.equal('8080');
                      expect(url.pathname).to.equal('/path');
                      expect(url.search).to.equal('?foo=bar');
                      expect(url.hash).to.equal('#hash');
                      expect(url.username).to.equal('user');
                      expect(url.password).to.equal('pass');
                      expect(url.origin).to.equal('https://example.com:8080');
                    });

                    test("URL modification", function() {
                      const url = new URL('https://example.com');
                      url.pathname = '/api/v1';
                      url.searchParams.set('key', 'value');
                      expect(url.toString()).to.equal('https://example.com/api/v1?key=value');
                    });

                    test("URLSearchParams", function() {
                      const params = new URLSearchParams('foo=1&bar=2&foo=3');
                      expect(params.get('foo')).to.equal('1');
                      expect(params.getAll('foo')).to.deep.equal(['1', '3']);
                      expect(params.has('bar')).to.equal(true);
                      expect(params.has('missing')).to.equal(false);

                      params.set('bar', 'updated');
                      params.delete('foo');
                      params.append('new', 'value');
                      expect(params.toString()).to.equal('bar=updated&new=value');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: web-crypto
              type: http
              seq: 4
            http:
              method: GET
              url: '{{host}}/ping'
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    // Skip in safe mode - these tests require developer sandbox
                    if (bru.isSafeMode()) {
                      bru.runner.skipRequest();
                      return;
                    }
                - type: tests
                  code: |-
                    test("crypto global exists", function() {
                      expect(typeof crypto).to.equal('object');
                      expect(typeof crypto.subtle).to.equal('object');
                    });

                    test("crypto.randomUUID", function() {
                      const uuid = crypto.randomUUID();
                      expect(uuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
                    });

                    test("crypto.getRandomValues", function() {
                      const array = new Uint8Array(16);
                      crypto.getRandomValues(array);
                      expect(array.some(b => b !== 0)).to.equal(true);
                    });

                    test("crypto.subtle methods exist", function() {
                      expect(crypto.subtle.digest).to.be.a('function');
                      expect(crypto.subtle.generateKey).to.be.a('function');
                      expect(crypto.subtle.sign).to.be.a('function');
                      expect(crypto.subtle.verify).to.be.a('function');
                      expect(crypto.subtle.encrypt).to.be.a('function');
                      expect(crypto.subtle.decrypt).to.be.a('function');
                      expect(crypto.subtle.importKey).to.be.a('function');
                      expect(crypto.subtle.exportKey).to.be.a('function');
                    });

                    test("crypto.subtle.digest returns promise", function() {
                      const data = new TextEncoder().encode('hello');
                      const result = crypto.subtle.digest('SHA-256', data);
                      expect(result).to.be.a('promise');
                    });

                    test("crypto.subtle.generateKey returns promise", function() {
                      const result = crypto.subtle.generateKey(
                        { name: 'AES-GCM', length: 256 },
                        true,
                        ['encrypt', 'decrypt']
                      );
                      expect(result).to.be.a('promise');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
      - info:
          name: npm modules
          type: folder
        items:
          - info:
              name: ajv
              type: http
              seq: 2
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "hello": "bruno"
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const Ajv = require('ajv');
                    const ajv = new Ajv();

                    // Define a JSON schema
                    const schema = {
                      type: 'object',
                      properties: {
                        name: { type: 'string', minLength: 1 },
                        age: { type: 'integer', minimum: 0 },
                        email: { type: 'string' }
                      },
                      required: ['name', 'age']
                    };

                    // Valid data to validate
                    const validData = {
                      name: 'Bruno User',
                      age: 25,
                      email: 'bruno@example.com'
                    };

                    // Compile and validate
                    const validate = ajv.compile(schema);
                    const isValid = validate(validData);

                    // Set validation result in request body
                    const data = req.getBody();
                    data.ajvValidation = {
                      isValid: isValid,
                      validatedData: validData
                    };

                    req.setBody(data);
                - type: tests
                  code: |-
                    test("ajv should validate data correctly", function() {
                      const data = res.getBody();

                      expect(data.hello).to.equal("bruno");
                      expect(data.ajvValidation).to.be.an('object');
                      expect(data.ajvValidation.isValid).to.be.true;
                      expect(data.ajvValidation.validatedData.name).to.equal('Bruno User');
                      expect(data.ajvValidation.validatedData.age).to.equal(25);
                    });

                    test("ajv should be available in tests", function() {
                      const Ajv = require('ajv');
                      const ajv = new Ajv();

                      const schema = { type: 'number' };
                      const validate = ajv.compile(schema);

                      expect(validate(42)).to.be.true;
                      expect(validate('not a number')).to.be.false;
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: external-lib-bru-req-res
              type: http
              seq: 5
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "name": "Bruno User",
                    "age": 25
                  }
            runtime:
              scripts:
                - type: tests
                  code: |-
                    const extLib = require('external-lib-with-bru-req-res-objects');

                    test("should provide bru object to npm modules", function() {
                      extLib.setVar('ext-lib-test', 'hello');
                      expect(extLib.getVar('ext-lib-test')).to.equal('hello');
                    });

                    test("should provide req object to npm modules", function() {
                      const method = extLib.getReqMethod();
                      expect(method).to.equal('POST');

                      const headers = extLib.getReqHeaders();
                      // expect(headers).to.be.an('object');
                      expect(headers['content-type']).to.include('json');
                    });

                    test("should provide res object to npm modules", function() {
                      const status = extLib.getResStatus();
                      expect(status).to.equal(200);

                      const body = extLib.getResBody();
                      // expect(body).to.be.an('object');
                      expect(body.name).to.equal('Bruno User');
                      expect(body.age).to.equal(25);

                      const headers = extLib.getResHeaders();
                      // expect(headers).to.be.an('object');
                      expect(headers['content-type']).to.include('json');
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: fakerjs
              type: http
              seq: 1
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "hello": "bruno"
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const { faker } = require('@faker-js/faker');
                    const uuid = faker.string.uuid();

                    const data = req.getBody();
                    data.uuid = uuid;

                    req.setBody(data);
                - type: tests
                  code: |-
                    test("should return json", function() {
                      const data = res.getBody();
                      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                      const isUUID = (inputString) => {
                        return uuidRegex.test(inputString);
                      };
                      
                      expect(data.hello).to.equal("bruno");
                      expect(isUUID(data.uuid)).to.be.true;
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
          - info:
              name: jose
              type: http
              seq: 3
            http:
              method: POST
              url: '{{host}}/api/echo/json'
              body:
                type: json
                data: |-
                  {
                    "hello": "bruno"
                  }
            runtime:
              scripts:
                - type: before-request
                  code: |-
                    const jose = require('jose');

                    // Create a symmetric secret for HS256
                    const secret = new TextEncoder().encode('my-super-secret-key-for-testing');

                    // Create a JWT with jose
                    const jwt = await new jose.SignJWT({ sub: 'bruno-user', name: 'Bruno' })
                      .setProtectedHeader({ alg: 'HS256' })
                      .setIssuedAt()
                      .setExpirationTime('1h')
                      .sign(secret);

                    // Verify the JWT
                    const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);

                    const data = req.getBody();
                    data.jwt = jwt;
                    data.verified = {
                      alg: protectedHeader.alg,
                      sub: payload.sub,
                      name: payload.name
                    };

                    req.setBody(data);
                - type: tests
                  code: |-
                    test("jose should create and verify JWT", function() {
                      const data = res.getBody();

                      expect(data.hello).to.equal("bruno");
                      expect(data.jwt).to.be.a('string');

                      // JWT should have 3 parts separated by dots
                      const parts = data.jwt.split('.');
                      expect(parts.length).to.equal(3);

                      // Verify the verification worked
                      expect(data.verified.alg).to.equal('HS256');
                      expect(data.verified.sub).to.equal('bruno-user');
                      expect(data.verified.name).to.equal('Bruno');
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
  - info:
      name: sse
      type: folder
    items:
      - info:
          name: sse finite stream
          type: http
          seq: 1
        http:
          method: GET
          url: '{{localhost}}/api/sse/finite'
        runtime:
          scripts:
            - type: after-response
              code: |-
                const body = res.getBody();
                bru.setVar("sseBody", typeof body === "string" ? body : JSON.stringify(body));
            - type: tests
              code: |-
                test("status is 200", function() {
                  expect(res.status).to.equal(200);
                });

                test("content-type is text/event-stream", function() {
                  expect(res.headers["content-type"]).to.include("text/event-stream");
                });

                test("res.getBody() contains all 3 SSE events in order", function() {
                  const body = res.getBody();
                  expect(body).to.include("data: Hello");
                  expect(body).to.include("data: from");
                  expect(body).to.include("data: SSE");
                  expect(body.indexOf("data: Hello")).to.be.lessThan(body.indexOf("data: from"));
                  expect(body.indexOf("data: from")).to.be.lessThan(body.indexOf("data: SSE"));
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: string interpolation
      type: folder
    request:
      variables:
        - name: folder_pre_var
          value: folder_pre_var_value
        - name: folder_pre_var_2
          value: '{{env.var1}}'
    items:
      - info:
          name: env vars
          type: http
          seq: 2
        http:
          method: POST
          url: '{{host}}/api/echo/json'
          body:
            type: json
            data: |-
              {
                "envVar1": "{{env.var1}}",
                "envVar2": "{{env-var2}}"
              }
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return json", function() {
                  expect(res.getBody()).to.eql({
                    "envVar1": "envVar1",
                    "envVar2": "envVar2"
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: missing values
          type: http
          seq: 1
        http:
          method: POST
          url: '{{host}}/api/echo/json?foo={{undefinedVar}}'
          params:
            - name: foo
              value: '{{undefinedVar}}'
              type: query
          body:
            type: json
            data: |-
              {
                "hello": "{{undefinedVar2}}"
              }
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return json", function() {
                  const url = req.getUrl();
                  const query = url.split("?")[1];
                  expect(query).to.equal("foo={{undefinedVar}}");

                  const data = res.getBody();
                  expect(res.getBody()).to.eql({
                    "hello": "{{undefinedVar2}}"
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: objects/arrays interpolation
          type: http
          seq: 5
        http:
          method: POST
          url: https://echo.usebruno.com
          body:
            type: json
            data: |-
              {
               "undefined": "{{obj.undefined}}",
               "null": {{obj.null}},
               "number": {{obj.number}},
               "boolean": {{obj.boolean}},
               "array": {{arr}},
               "array[0]": {{arr[0]}},
               "object": {{obj}},
               "object.foo": {{obj.foo}},
               "object.foo.bar": {{obj.foo.bar}},
               "object.foo.bar.baz": {{obj.foo.bar.baz}}
              }
        runtime:
          scripts:
            - type: before-request
              code: |-
                bru.setVar("arr", [1,2,3,4,5]);

                bru.setVar("obj", {
                  "null": null,
                  "number": 1,
                  "boolean": true,
                  "foo": {
                    "bar": {
                      "baz": 1
                    }
                  }
                });
            - type: tests
              code: |-
                test("should interpolate arrays and objects in request payload body", () => {
                  const resBody = res.getBody();
                  const expectedOutput = {
                    "undefined": "{{obj.undefined}}",
                    "null": null,
                    "number": 1,
                    "boolean": true,
                    "array": [
                      1,
                      2,
                      3,
                      4,
                      5
                    ],
                    "array[0]": 1,
                    "object": {
                      "null": null,
                      "number": 1,
                      "boolean": true,
                      "foo": {
                        "bar": {
                          "baz": 1
                        }
                      }
                    },
                    "object.foo": {
                      "bar": {
                        "baz": 1
                      }
                    },
                    "object.foo.bar": {
                      "baz": 1
                    },
                    "object.foo.bar.baz": 1
                  };
                  expect(resBody).to.be.eql(expectedOutput);
                })
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: process env vars
          type: http
          seq: 4
        http:
          method: POST
          url: '{{host}}/api/echo/json'
          body:
            type: json
            data: |-
              {
                "bark": "{{bark}}",
                "bark2": "{{process.env.PROC_ENV_VAR}}"
              }
        runtime:
          scripts:
            - type: tests
              code: |-
                test("should return json", function() {
                  expect(res.getBody()).to.eql({
                    "bark": "woof",
                    "bark2": "woof"
                  });
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: runtime vars
          type: http
          seq: 3
        http:
          method: POST
          url: '{{host}}/api/echo/text'
          body:
            type: text
            data: |-
              Hi, I am {{rUser.full_name}},
              I am {{rUser.age}} years old.
              My favorite food is {{rUser.fav-food[0]}} and {{rUser.fav-food[1]}}.
              I like attention: {{rUser['want.attention']}}
        runtime:
          scripts:
            - type: before-request
              code: |-
                const brunoBirthDate = new Date('2019-08-08');

                const calculateAgeFromBirthDate = (birthDate = brunoBirthDate) => {
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();

                  const hasBirthdayPassedThisYear =
                    today.getMonth() > birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

                  if (!hasBirthdayPassedThisYear) {
                    age--;
                  }

                  return age;
                };

                const brunoAge = calculateAgeFromBirthDate(brunoBirthDate);

                bru.setVar("rUser", {
                  full_name: 'Bruno',
                  age: brunoAge,
                  'fav-food': ['egg', 'meat'],
                  'want.attention': true
                });
            - type: tests
              code: |-
                test("should return json", function() {
                  const brunoBirthDate = new Date('2019-08-08');

                  const calculateAgeFromBirthDate = (birthDate = brunoBirthDate) => {
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();

                    const hasBirthdayPassedThisYear =
                      today.getMonth() > birthDate.getMonth() ||
                      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

                    if (!hasBirthdayPassedThisYear) {
                      age--;
                    }

                    return age;
                  };

                  const brunoAge = calculateAgeFromBirthDate(brunoBirthDate);

                  const expectedResponse = \`Hi, I am Bruno,
                I am \${brunoAge} years old.
                My favorite food is egg and meat.
                I like attention: true\`;
                  expect(res.getBody()).to.equal(expectedResponse);
                });
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
  - info:
      name: test folder
      type: folder
      seq: 18
    request:
      auth: inherit
    docs:
      content: Test folder with description
      type: text/markdown
  - info:
      name: url-serialization
      type: folder
      seq: 13
    request:
      auth: inherit
    items:
      - info:
          name: Duplicate Keys
          type: http
          seq: 1
        http:
          method: POST
          url: https://echo.usebruno.com
          headers:
            - name: Content-Type
              value: application/x-www-form-urlencoded
          body:
            type: form-urlencoded
            data:
              - name: tags
                value: frontend
              - name: tags
                value: api
              - name: user
                value: john
        runtime:
          scripts:
            - type: after-response
              code: |-
                test('Response body matches expected value', function () {
                    expect(res.getBody()).to.eql("tags=frontend&tags=api&user=john");
                });
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
      - info:
          name: scheme
          type: http
          seq: 1
        http:
          method: GET
          url: localhost:8081/ping
        runtime:
          assertions:
            - expression: res.status
              operator: eq
              value: '200'
            - expression: res.body
              operator: eq
              value: pong
        settings:
          encodeUrl: true
          timeout: 0
          followRedirects: true
          maxRedirects: 5
request:
  headers:
    - name: check
      value: again
    - name: token
      value: '{{collection_pre_var_token}}'
    - name: collection-header
      value: collection-header-value
  auth:
    type: bearer
    token: '{{bearer_auth_token}}'
  variables:
    - name: collection_pre_var
      value: collection_pre_var_value
    - name: collection_pre_var_token
      value: '{{request_pre_var_token}}'
    - name: collection-var
      value: collection-var-value
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
  content: |-
    # bruno-testbench 🐶

    This is a test collection that I am using to test various functionalities around bruno
  type: text/markdown
bundled: true
extensions:
  bruno:
    presets:
      requestType: http
      requestUrl: http://localhost:6000
    exportedAt: '2026-07-01T15:29:54.110Z'
    exportedUsing: Bruno
`;
