export const sampleCollectionYaml = `
opencollection: "1.0.0"
info:
  name: "Bruno Testbench"
  summary: "A comprehensive API collection for testing OpenCollection features"
  version: "1.0.0"
config:
  environments:
    - name: "Local"
      color: "#16a34a"
      variables:
        - name: "host"
          value: "http://localhost:8081"
        - name: "retryCount"
          value:
            type: "number"
            data: "3"
        - name: "featureEnabled"
          value:
            type: "boolean"
            data: "true"
        - name: "defaultUser"
          value:
            type: "object"
            data: '{"role":"admin"}'
        - name: "bearer_auth_token"
          secret: true
          type: "string"
    - name: "Prod"
      color: "#dc2626"
      variables:
        - name: "host"
          value: "https://echo.usebruno.com"
        - name: "bearer_auth_token"
          secret: true
          type: "string"
      externalSecrets:
        type: aws-secrets-manager
        variables:
          - name: dbPassword
            secretName: prod/db/credentials
            enabled: true
          - name: apiKey
            secretName: prod/payment-gateway/api-key
            enabled: true
request:
  headers:
    - name: "collection-header"
      value: "collection-header-value"
      type: "uuid"
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
  - name: "Realtime"
    type: "folder"
    items:
      - name: "Live Updates"
        description: "Streams live order updates over a WebSocket connection."
        type: "websocket"
        url: "{{host}}/ws/updates"
        docs: "Connect to receive real-time order updates. Messages are JSON-encoded and pushed as events occur."
      - name: "GraphQL API"
        type: "graphql"
        url: "{{host}}/graphql"
      - name: "Order Service"
        type: "grpc"
        url: "{{host}}/orders.OrderService"
  - info:
      name: billing
      type: folder
      seq: 4
    docs: |
      ## Billing

      Endpoints for managing **customers** and their invoices.

      - Auth is **inherited** from the collection.
      - Folder-level scripts record the execution chain for every request inside.
    request:
      auth: inherit
      scripts:
        - type: before-request
          code: |
            // Folder "billing" · pre-request (L1)
            console.log('PRE  > L1 billing');
            bru.setVar('execChain', (bru.getVar('execChain') || '') + 'F1(billing)>');
        - type: after-response
          code: |
            // Folder "billing" · post-response (L1)
            console.log('POST > L1 billing');
            bru.setVar('execChain', (bru.getVar('execChain') || '') + '>F1(billing)');
    items:
      - info:
          name: Script
          type: script
          seq: 0
        script: |
          {
            "email": "user@example.com",
            "password": "password123"
          }
      - info:
          name: customers
          type: folder
          seq: 1
        request:
          auth: inherit
          scripts:
            - type: before-request
              code: |
                // Folder "customers" · pre-request (L2, nested under billing)
                console.log('PRE  > L2 customers');
                bru.setVar('execChain', (bru.getVar('execChain') || '') + 'F2(customers)>');
            - type: after-response
              code: |
                // Folder "customers" · post-response (L2)
                console.log('POST > L2 customers');
                bru.setVar('execChain', (bru.getVar('execChain') || '') + '>F2(customers)');
            - type: tests
              code: |
                // Folder "customers" · tests (folder-scoped — inherited by every request inside)
                test('customers folder scripts ran before the request', () => {
                  expect(bru.getVar('execChain')).to.contain('F2(customers)');
                });
        items:
          - info:
              name: Get All Customers
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/billing/customers'
              auth: inherit
            runtime:
              variables:
                - name: expectedStatus
                  value: '200'
                - name: customersPath
                  value: /billing/customers
                - name: defaultPerPage
                  value: '10'
                - name: legacyApiVersion
                  value: v1
                  disabled: true
              scripts:
                - type: before-request
                  code: |
                    // Request "Get All Customers" · pre-request (L3, innermost)
                    // Runs last in PRE, right before the request is sent.
                    console.log('PRE  > L3 request');
                    bru.setVar('execChain', (bru.getVar('execChain') || '') + 'R3>');
                - type: after-response
                  code: |
                    // Request · post-response (L3) — sandwich: FIRST of post · sequential: last
                    console.log('POST > L3 request');
                    bru.setVar('execChain', (bru.getVar('execChain') || '') + '>R3');
                - type: tests
                  code: |
                    // Request · tests — validate the customers list response
                    test('status is 200 OK', () => {
                      expect(res.getStatus()).to.equal(200);
                    });

                    test('response body is a non-empty array', () => {
                      const body = res.getBody();
                      expect(body).to.be.an('array');
                      expect(body.length).to.be.above(0);
                    });

                    test('every customer has an id and email', () => {
                      res.getBody().forEach((customer) => {
                        expect(customer).to.have.property('id');
                        expect(customer).to.have.property('email');
                      });
                    });

                    test('multi-level execution chain captured', () => {
                      expect(bru.getVar('execChain')).to.contain('C0');
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                - expression: res.body.length
                  operator: gt
                  value: '0'
                - expression: res.body[0].status
                  operator: eq
                  value: active
                - expression: "res.headers['x-total-count']"
                  operator: isNotEmpty
                - expression: res.responseTime
                  operator: lt
                  value: '500'
                  disabled: true
              actions:
                - type: set-variable
                  phase: after-response
                  selector:
                    expression: res.body[0].id
                    method: jsonq
                  variable:
                    name: firstCustomerId
                    scope: runtime
                - type: set-variable
                  phase: after-response
                  selector:
                    expression: "res.headers['x-total-count']"
                    method: jsonq
                  variable:
                    name: totalCustomers
                    scope: collection
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            examples:
              - name: 200 OK - first page
                description: Default pagination returns the first page of customers.
                request:
                  method: GET
                  url: '{{baseUrl}}/billing/customers?page=1&per_page=10'
                  params:
                    - name: page
                      value: '1'
                      type: query
                    - name: per_page
                      value: '10'
                      type: query
                  headers:
                    - name: Accept
                      value: application/json
                      type: string
                    - name: X-Request-Id
                      value: '{{requestId}}'
                      type: uuid
                  auth:
                    type: bearer
                    token: '{{bearer_token}}'
                response:
                  status: 200
                  statusText: OK
                  headers:
                    - name: Content-Type
                      value: application/json
                      type: string
                    - name: x-total-count
                      value: '42'
                      type: integer
                  body:
                    type: json
                    data: |
                      [
                        {
                          "id": "cus_ABC123xyz",
                          "email": "john.smith@example.com",
                          "name": "John Smith",
                          "status": "active",
                          "created": 1704067200
                        }
                      ]
              - name: 400 Bad Request - invalid per_page
                description: A per_page above the max of 50 is rejected.
                request:
                  method: GET
                  url: '{{baseUrl}}/billing/customers?per_page=999'
                  params:
                    - name: per_page
                      value: '999'
                      type: query
                response:
                  status: 400
                  statusText: Bad Request
                  headers:
                    - name: Content-Type
                      value: application/json
                  body:
                    type: json
                    data: |
                      {
                        "error": "invalid_request",
                        "message": "per_page must be between 1 and 50"
                      }
            docs: |
              # Get All Customers

              Retrieves all customers with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of customer objects. The \`x-total-count\` header contains total customers.

              ### Customer Object Structure

              \`\`\`json
              {
                "id": "cus_ABC123xyz",
                "email": "john.smith@example.com",
                "name": "John Smith",
                "phone": "+12025551234",
                "status": "active",
                "created": 1704067200,
                "metadata": {
                  "source": "website",
                  "signup_date": "2024-01-01"
                }
              }
              \`\`\`

              ### Customer Statuses

              - \`active\` - Active customer (80% of customers)
              - \`inactive\` - Inactive customer
              - \`deleted\` - Deleted customer

              ## Example

              \`GET /billing/customers\`
          - info:
              name: Get Customers - Filter by Date Range
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/billing/customers?created[gte]=2024-01-01&created[lte]=2024-12-31&page=1&per_page=20'
              params:
                - name: created[gte]
                  value: '2024-01-01'
                  type: query
                - name: created[lte]
                  value: '2024-12-31'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '20'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Customers - Filter by Date Range

              Retrieves customers created within a date range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`created[gte]\` | string | **Required.** Start date (ISO 8601 format, e.g., \`2024-01-01\`) |
              | \`created[lte]\` | string | **Required.** End date (ISO 8601 format, e.g., \`2024-12-31\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`created[gte]\`: Returns customers created on or after this date
              - \`created[lte]\`: Returns customers created on or before this date
              - Dates are compared as Unix timestamps (seconds since epoch)
              - Customer creation dates span the last 2 years from 2024-01-01

              ## Response

              Returns an array of customers created within the date range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/customers?created[gte]=2024-01-01&created[lte]=2024-12-31&page=1&per_page=20\`
          - info:
              name: Get Customers - Filter by Email
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/billing/customers?email=john.smith@example.com'
              params:
                - name: email
                  value: john.smith@example.com
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Customers - Filter by Email

              Retrieves customers filtered by exact email address match.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`email\` | string | **Required.** Exact email address (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - Email matching is case-insensitive
              - Returns customers with exact email match

              ## Response

              Returns an array of customers matching the email. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/customers?email=john.smith@example.com\`
          - info:
              name: Get Customers - Filter by Status
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/billing/customers?status=active'
              params:
                - name: status
                  value: active
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Customers - Filter by Status

              Retrieves customers filtered by status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Customer status (\`active\`, \`inactive\`, or \`deleted\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`active\` - Active customer
              - \`inactive\` - Inactive customer
              - \`deleted\` - Deleted customer

              ## Response

              Returns an array of customers with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/customers?status=active\`
      - info:
          name: invoices
          type: folder
          seq: 4
        request:
          auth: inherit
        items:
          - info:
              name: Get All Invoices
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/billing/invoices'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Invoices

              Retrieves all invoices with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of invoice objects. The \`x-total-count\` header contains total invoices.

              ### Invoice Object Structure

              \`\`\`json
              {
                "id": "inv_ABC123xyz",
                "customer": "cus_ABC123xyz",
                "subscription": "sub_ABC123xyz",
                "amount_due": 2999,
                "amount_paid": 2999,
                "currency": "USD",
                "status": "paid",
                "due_date": 1704153600,
                "paid_at": 1704067200,
                "created": 1704067200,
                "invoice_number": "INV-2024-000001"
              }
              \`\`\`

              **Note:** Amounts are in cents (e.g., 2999 = $29.99). Dates are Unix timestamps (seconds).

              ### Invoice Statuses

              - \`draft\` - Draft invoice
              - \`open\` - Open/unpaid invoice
              - \`paid\` - Paid invoice (50% of invoices)
              - \`void\` - Voided invoice
              - \`uncollectible\` - Uncollectible invoice

              ## Example

              \`GET /billing/invoices\`
          - info:
              name: Get Invoices - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/billing/invoices?customer=cus_ABC123&status=open&due_date[gte]=2024-01-01&page=1&per_page=20'
              params:
                - name: customer
                  value: cus_ABC123
                  type: query
                - name: status
                  value: open
                  type: query
                - name: due_date[gte]
                  value: '2024-01-01'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '20'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Invoices - Combined Filters

              Retrieves invoices using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | Filter by customer ID |
              | \`subscription\` | string | Filter by subscription ID |
              | \`status\` | string | Filter by invoice status |
              | \`due_date[gte]\` | string | Filter by due date (greater than or equal, \`yyyy-mm-dd\`) |
              | \`due_date[lte]\` | string | Filter by due date (less than or equal, \`yyyy-mm-dd\`) |
              | \`created[gte]\` | string | Filter by creation date (greater than or equal, ISO 8601) |
              | \`created[lte]\` | string | Filter by creation date (less than or equal, ISO 8601) |
              | \`min_amount_due\` | integer | Minimum amount due (in cents) |
              | \`max_amount_due\` | integer | Maximum amount due (in cents) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Status matching is case-insensitive
              - Amount filters compare against \`amount_due\` field (in cents)

              ## Response

              Returns an array of invoices matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/invoices?customer=cus_ABC123&status=open&due_date[gte]=2024-01-01&page=1&per_page=20\`
          - info:
              name: Get Invoices - Filter by Customer
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/billing/invoices?customer=cus_ABC123'
              params:
                - name: customer
                  value: cus_ABC123
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Invoices - Filter by Customer

              Retrieves invoices for a specific customer.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | **Required.** Customer ID (e.g., \`cus_ABC123\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of invoices for the specified customer. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/invoices?customer=cus_ABC123\`
          - info:
              name: Get Invoices - Filter by Due Date
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/billing/invoices?due_date[gte]=2024-01-01&due_date[lte]=2024-12-31'
              params:
                - name: due_date[gte]
                  value: '2024-01-01'
                  type: query
                - name: due_date[lte]
                  value: '2024-12-31'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Invoices - Filter by Due Date

              Retrieves invoices with due dates within a specified range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`due_date[gte]\` | string | **Required.** Start date (\`yyyy-mm-dd\` format) |
              | \`due_date[lte]\` | string | **Required.** End date (\`yyyy-mm-dd\` format) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`due_date[gte]\`: Returns invoices due on or after this date
              - \`due_date[lte]\`: Returns invoices due on or before this date
              - Dates are converted to Unix timestamps for comparison
              - Due dates are typically 7-30 days after invoice creation

              ## Response

              Returns an array of invoices with due dates within the range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/invoices?due_date[gte]=2024-01-01&due_date[lte]=2024-12-31\`
          - info:
              name: Get Invoices - Filter by Status
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/billing/invoices?status=paid'
              params:
                - name: status
                  value: paid
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Invoices - Filter by Status

              Retrieves invoices filtered by status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Invoice status (\`draft\`, \`open\`, \`paid\`, \`void\`, or \`uncollectible\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`draft\` - Draft invoice
              - \`open\` - Open/unpaid invoice
              - \`paid\` - Paid invoice
              - \`void\` - Voided invoice
              - \`uncollectible\` - Uncollectible invoice

              ## Response

              Returns an array of invoices with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/invoices?status=paid\`
      - info:
          name: lookups
          type: folder
          seq: 5
        request:
          auth: inherit
        items:
          - info:
              name: Get Currencies
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/currencies'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Currencies

              Retrieves the list of supported currencies.

              ## Response

              Returns an array of currency codes (strings).

              ### Available Currencies (6 total)

              - USD (US Dollar)
              - EUR (Euro)
              - GBP (British Pound)
              - JPY (Japanese Yen)
              - CAD (Canadian Dollar)
              - AUD (Australian Dollar)

              ## Example

              \`GET /billing/lookups/currencies\`
          - info:
              name: Get Customer Statuses
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/customerStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Customer Statuses

              Retrieves the list of customer statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Customer Statuses (3 total)

              - \`active\` - Active customer
              - \`inactive\` - Inactive customer
              - \`deleted\` - Deleted customer

              ## Example

              \`GET /billing/lookups/customerStatuses\`
          - info:
              name: Get Invoice Statuses
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/invoiceStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Invoice Statuses

              Retrieves the list of invoice statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Invoice Statuses (5 total)

              - \`draft\` - Draft invoice
              - \`open\` - Open/unpaid invoice
              - \`paid\` - Paid invoice
              - \`void\` - Voided invoice
              - \`uncollectible\` - Uncollectible invoice

              ## Example

              \`GET /billing/lookups/invoiceStatuses\`
          - info:
              name: Get Payment Methods
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/paymentMethods'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payment Methods

              Retrieves the list of supported payment methods.

              ## Response

              Returns an array of payment method names (strings).

              ### Available Payment Methods (5 total)

              - \`card\` - Credit/debit card
              - \`bank_transfer\` - Bank transfer
              - \`paypal\` - PayPal
              - \`apple_pay\` - Apple Pay
              - \`google_pay\` - Google Pay

              ## Example

              \`GET /billing/lookups/paymentMethods\`
          - info:
              name: Get Payment Statuses
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/paymentStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payment Statuses

              Retrieves the list of payment statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Payment Statuses (4 total)

              - \`succeeded\` - Payment succeeded
              - \`pending\` - Payment pending
              - \`failed\` - Payment failed
              - \`refunded\` - Payment refunded

              ## Example

              \`GET /billing/lookups/paymentStatuses\`
          - info:
              name: Get Plans
              type: http
              seq: 7
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/plans'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Plans

              Retrieves the list of available subscription plans.

              ## Response

              Returns an array of plan names (strings).

              ### Available Plans (3 total)

              | Plan | Monthly Price |
              |------|---------------|
              | Basic | $9.99 (999 cents/month) |
              | Pro | $29.99 (2999 cents/month) |
              | Enterprise | $99.99 (9999 cents/month) |

              ## Example

              \`GET /billing/lookups/plans\`
          - info:
              name: Get Subscription Statuses
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/billing/lookups/subscriptionStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Subscription Statuses

              Retrieves the list of subscription statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Subscription Statuses (5 total)

              - \`active\` - Active subscription
              - \`trialing\` - Trial period
              - \`past_due\` - Past due payment
              - \`canceled\` - Canceled subscription
              - \`incomplete\` - Incomplete setup

              ## Example

              \`GET /billing/lookups/subscriptionStatuses\`
      - info:
          name: payments
          type: folder
          seq: 3
        request:
          auth: inherit
        items:
          - info:
              name: Get All Payments
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Payments

              Retrieves all payments with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of payment objects. The \`x-total-count\` header contains total payments.

              ### Payment Object Structure

              \`\`\`json
              {
                "id": "pay_ABC123xyz",
                "customer": "cus_ABC123xyz",
                "subscription": "sub_ABC123xyz",
                "invoice": "inv_ABC123xyz",
                "amount": 2999,
                "currency": "USD",
                "status": "succeeded",
                "payment_method": "card",
                "description": "Monthly subscription",
                "created": 1704067200,
                "paid_at": 1704067200
              }
              \`\`\`

              **Note:** Amounts are in cents (e.g., 2999 = $29.99). Dates are Unix timestamps (seconds).

              ### Payment Statuses

              - \`succeeded\` - Payment succeeded (85% of payments)
              - \`pending\` - Payment pending
              - \`failed\` - Payment failed
              - \`refunded\` - Payment refunded

              ### Payment Methods

              - \`card\` - Credit/debit card
              - \`bank_transfer\` - Bank transfer
              - \`paypal\` - PayPal
              - \`apple_pay\` - Apple Pay
              - \`google_pay\` - Google Pay

              ## Example

              \`GET /billing/payments\`
          - info:
              name: Get Payments - Combined Filters
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments?customer=cus_ABC123&status=succeeded&payment_method=card&created[gte]=2024-01-01&page=1&per_page=20'
              params:
                - name: customer
                  value: cus_ABC123
                  type: query
                - name: status
                  value: succeeded
                  type: query
                - name: payment_method
                  value: card
                  type: query
                - name: created[gte]
                  value: '2024-01-01'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '20'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payments - Combined Filters

              Retrieves payments using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | Filter by customer ID |
              | \`subscription\` | string | Filter by subscription ID |
              | \`invoice\` | string | Filter by invoice ID |
              | \`status\` | string | Filter by payment status |
              | \`payment_method\` | string | Filter by payment method |
              | \`created[gte]\` | string | Filter by creation date (greater than or equal, ISO 8601) |
              | \`created[lte]\` | string | Filter by creation date (less than or equal, ISO 8601) |
              | \`min_amount\` | integer | Minimum amount in cents |
              | \`max_amount\` | integer | Maximum amount in cents |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Status and payment_method matching is case-insensitive
              - Amount filters compare against \`amount\` field (in cents)

              ## Response

              Returns an array of payments matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/payments?customer=cus_ABC123&status=succeeded&payment_method=card&created[gte]=2024-01-01&page=1&per_page=20\`
          - info:
              name: Get Payments - Filter by Amount Range
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments?min_amount=1000&max_amount=10000'
              params:
                - name: min_amount
                  value: '1000'
                  type: query
                - name: max_amount
                  value: '10000'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payments - Filter by Amount Range

              Retrieves payments within a specified amount range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`min_amount\` | integer | Minimum amount in cents (e.g., 1000 = $10.00) |
              | \`max_amount\` | integer | Maximum amount in cents (e.g., 10000 = $100.00) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - Amounts are specified in cents
              - \`min_amount\`: Returns payments with amount >= this value
              - \`max_amount\`: Returns payments with amount <= this value
              - Payment amounts range from $5.00 (500 cents) to $500.00 (50000 cents)

              ## Response

              Returns an array of payments within the amount range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/payments?min_amount=1000&max_amount=10000\`
          - info:
              name: Get Payments - Filter by Customer
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments?customer=cus_ABC123'
              params:
                - name: customer
                  value: cus_ABC123
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payments - Filter by Customer

              Retrieves payments for a specific customer.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | **Required.** Customer ID (e.g., \`cus_ABC123\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of payments for the specified customer. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/payments?customer=cus_ABC123\`
          - info:
              name: Get Payments - Filter by Payment Method
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments?payment_method=card'
              params:
                - name: payment_method
                  value: card
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payments - Filter by Payment Method

              Retrieves payments filtered by payment method.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`payment_method\` | string | **Required.** Payment method (\`card\`, \`bank_transfer\`, \`paypal\`, \`apple_pay\`, or \`google_pay\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Payment Methods

              - \`card\` - Credit/debit card
              - \`bank_transfer\` - Bank transfer
              - \`paypal\` - PayPal
              - \`apple_pay\` - Apple Pay
              - \`google_pay\` - Google Pay

              ## Response

              Returns an array of payments using the specified payment method. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/payments?payment_method=card\`
          - info:
              name: Get Payments - Filter by Status
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/billing/payments?status=succeeded'
              params:
                - name: status
                  value: succeeded
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Payments - Filter by Status

              Retrieves payments filtered by status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Payment status (\`succeeded\`, \`pending\`, \`failed\`, or \`refunded\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`succeeded\` - Payment succeeded
              - \`pending\` - Payment pending
              - \`failed\` - Payment failed
              - \`refunded\` - Payment refunded

              ## Response

              Returns an array of payments with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/payments?status=succeeded\`
      - info:
          name: subscriptions
          type: folder
          seq: 2
        request:
          auth: inherit
        items:
          - info:
              name: Get All Subscriptions
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/billing/subscriptions'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Subscriptions

              Retrieves all subscriptions with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of subscription objects. The \`x-total-count\` header contains total subscriptions.

              ### Subscription Object Structure

              \`\`\`json
              {
                "id": "sub_ABC123xyz",
                "customer": "cus_ABC123xyz",
                "status": "active",
                "plan": "Pro",
                "amount": 2999,
                "currency": "USD",
                "current_period_start": 1704067200,
                "current_period_end": 1706745600,
                "cancel_at_period_end": false,
                "created": 1704067200
              }
              \`\`\`

              **Note:** Amounts are in cents per month (e.g., 2999 = $29.99/month). Dates are Unix timestamps (seconds).

              ### Subscription Statuses

              - \`active\` - Active subscription (70% of subscriptions)
              - \`trialing\` - Trial period
              - \`past_due\` - Past due payment
              - \`canceled\` - Canceled subscription
              - \`incomplete\` - Incomplete setup

              ### Plans

              - \`Basic\` - $9.99/month (999 cents)
              - \`Pro\` - $29.99/month (2999 cents)
              - \`Enterprise\` - $99.99/month (9999 cents)

              ## Example

              \`GET /billing/subscriptions\`
          - info:
              name: Get Subscriptions - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/billing/subscriptions?status=active&plan=Pro&created[gte]=2024-01-01&page=1&per_page=20'
              params:
                - name: status
                  value: active
                  type: query
                - name: plan
                  value: Pro
                  type: query
                - name: created[gte]
                  value: '2024-01-01'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '20'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Subscriptions - Combined Filters

              Retrieves subscriptions using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | Filter by customer ID |
              | \`status\` | string | Filter by subscription status |
              | \`plan\` | string | Filter by plan name |
              | \`created[gte]\` | string | Filter by creation date (greater than or equal, ISO 8601) |
              | \`created[lte]\` | string | Filter by creation date (less than or equal, ISO 8601) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Status matching is case-insensitive
              - Plan matching is exact (case-sensitive)

              ## Response

              Returns an array of subscriptions matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/subscriptions?status=active&plan=Pro&created[gte]=2024-01-01&page=1&per_page=20\`
          - info:
              name: Get Subscriptions - Filter by Customer
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/billing/subscriptions?customer=cus_ABC123'
              params:
                - name: customer
                  value: cus_ABC123
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Subscriptions - Filter by Customer

              Retrieves subscriptions for a specific customer.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`customer\` | string | **Required.** Customer ID (e.g., \`cus_ABC123\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of subscriptions for the specified customer. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/subscriptions?customer=cus_ABC123\`
          - info:
              name: Get Subscriptions - Filter by Plan
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/billing/subscriptions?plan=Pro'
              params:
                - name: plan
                  value: Pro
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Subscriptions - Filter by Plan

              Retrieves subscriptions filtered by plan type.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`plan\` | string | **Required.** Plan name (\`Basic\`, \`Pro\`, or \`Enterprise\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Plans

              | Plan | Monthly Price |
              |------|---------------|
              | Basic | $9.99 (999 cents) |
              | Pro | $29.99 (2999 cents) |
              | Enterprise | $99.99 (9999 cents) |

              ## Response

              Returns an array of subscriptions for the specified plan. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/subscriptions?plan=Pro\`
          - info:
              name: Get Subscriptions - Filter by Status
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/billing/subscriptions?status=active'
              params:
                - name: status
                  value: active
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Subscriptions - Filter by Status

              Retrieves subscriptions filtered by status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Subscription status (\`active\`, \`trialing\`, \`past_due\`, \`canceled\`, or \`incomplete\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`active\` - Active subscription
              - \`trialing\` - Trial period
              - \`past_due\` - Past due payment
              - \`canceled\` - Canceled subscription
              - \`incomplete\` - Incomplete setup

              ## Response

              Returns an array of subscriptions with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /billing/subscriptions?status=active\`
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
