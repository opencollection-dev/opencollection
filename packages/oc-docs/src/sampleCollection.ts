export const sampleCollectionYaml = `
opencollection: 1.0.0
info:
  name: bruno-genui-collection
config:
  proxy:
    inherit: true
    config:
      protocol: http
      hostname: ''
      port: ''
      auth:
        username: ''
        password: ''
      bypassProxy: ''
  environments:
    - name: Prod
      variables:
        - name: baseUrl
          value: https://mockdata.dev
request:
  scripts:
    - type: before-request
      code: |
        // Collection · pre-request (L0, outermost) — runs first in BOTH flows
        console.log('PRE  > L0 collection');
        bru.setVar('execChain', (bru.getVar('execChain') || '') + 'C0>');
    - type: after-response
      code: |
        // Collection · post-response (L0) — sandwich: LAST · sequential: first of post phase
        console.log('POST > L0 collection');
        bru.setVar('execChain', (bru.getVar('execChain') || '') + '>C0');
    - type: tests
      code: |
        // Collection · tests (additive across every level)
        test('collection-level script executed', () => {
          expect(bru.getVar('execChain')).to.be.a('string');
        });
items:
  - info:
      name: billing
      type: folder
      seq: 4
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
                  auth:
                    type: bearer
                    token: '{{bearer_token}}'
                response:
                  status: 200
                  statusText: OK
                  headers:
                    - name: Content-Type
                      value: application/json
                    - name: x-total-count
                      value: '42'
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
  - info:
      name: flights
      type: folder
      seq: 1
    request:
      auth: inherit
      scripts:
        - type: before-request
          code: |
            // Folder "flights" · pre-request (L1)
            console.log('PRE  > L1 flights');
            bru.setVar('execChain', (bru.getVar('execChain') || '') + 'F1(flights)>');
        - type: after-response
          code: |
            // Folder "flights" · post-response (L1)
            console.log('POST > L1 flights');
            bru.setVar('execChain', (bru.getVar('execChain') || '') + '>F1(flights)');
    items:
      - info:
          name: lookups
          type: folder
          seq: 3
        request:
          auth: inherit
        items:
          - info:
              name: Get Aircraft Types
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/flights/lookups/aircraftTypes'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Aircraft Types

              Retrieves the list of all supported aircraft types.

              ## Response

              Returns an array of aircraft type names (strings).

              ### Available Aircraft Types (8 total)

              - Airbus A320
              - Boeing 737
              - Airbus A321
              - Boeing 787
              - Airbus A319
              - Boeing 777
              - Embraer E175
              - Bombardier CRJ900

              ## Example

              \`GET /flights/lookups/aircraftTypes\`
          - info:
              name: Get Airlines
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/flights/lookups/airlines'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Airlines

              Retrieves the list of all supported airlines.

              ## Response

              Returns an array of airline names (strings).

              ### Available Airlines (9 total)

              - Allegiant Air
              - American Airlines
              - Delta Air Lines
              - United Airlines
              - Southwest Airlines
              - JetBlue Airways
              - Alaska Airlines
              - Spirit Airlines
              - Frontier Airlines

              ## Example

              \`GET /flights/lookups/airlines\`
          - info:
              name: Get Airports
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/flights/lookups/airports'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Airports

              Retrieves the list of all supported airports.

              ## Response

              Returns an array of airport objects.

              ### Airport Object

              \`\`\`json
              {
                "code": "JFK",
                "city": "New York",
                "name": "John F. Kennedy Intl"
              }
              \`\`\`

              ### Available Airports (20 total)

              | Code | City | Name |
              |------|------|------|
              | SFB | Orlando | Orlando Sanford Intl |
              | LAS | Las Vegas | Harry Reid Intl |
              | LAX | Los Angeles | Los Angeles Intl |
              | JFK | New York | John F. Kennedy Intl |
              | ORD | Chicago | O'Hare Intl |
              | DFW | Dallas | Dallas/Fort Worth Intl |
              | DEN | Denver | Denver Intl |
              | ATL | Atlanta | Hartsfield-Jackson Atlanta Intl |
              | SEA | Seattle | Seattle-Tacoma Intl |
              | MIA | Miami | Miami Intl |
              | PHX | Phoenix | Phoenix Sky Harbor Intl |
              | IAH | Houston | George Bush Intercontinental |
              | BOS | Boston | Logan Intl |
              | SFO | San Francisco | San Francisco Intl |
              | MSP | Minneapolis | Minneapolis-St. Paul Intl |
              | DTW | Detroit | Detroit Metro |
              | PHL | Philadelphia | Philadelphia Intl |
              | CLT | Charlotte | Charlotte Douglas Intl |
              | LGA | New York | LaGuardia |
              | BWI | Baltimore | Baltimore/Washington Intl |

              ## Example

              \`GET /flights/lookups/airports\`
          - info:
              name: Get Fare Types
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/flights/lookups/fareTypes'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Fare Types

              Retrieves the list of all supported fare types.

              ## Response

              Returns an array of fare type names (strings).

              ### Available Fare Types (4 total)

              | Fare Type | Description |
              |-----------|-------------|
              | Basic | Economy fare with limited flexibility |
              | Standard | Regular fare with standard amenities |
              | Flex | Flexible fare with change/cancel options |
              | Premium | Premium fare with enhanced services |

              ## Example

              \`GET /flights/lookups/fareTypes\`
      - info:
          name: order
          type: folder
          seq: 2
        request:
          auth: inherit
          scripts:
            - type: before-request
              code: |
                // Folder "order" · pre-request (L2, nested under flights)
                console.log('PRE  > L2 order');
                bru.setVar('execChain', (bru.getVar('execChain') || '') + 'F2(order)>');
            - type: after-response
              code: |
                // Folder "order" · post-response (L2)
                console.log('POST > L2 order');
                bru.setVar('execChain', (bru.getVar('execChain') || '') + '>F2(order)');
        items:
          - info:
              name: Get All Orders
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/flights/orders'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            examples:
              - name: 200 OK - all orders
                description: Returns flight orders with default pagination.
                request:
                  method: GET
                  url: '{{baseUrl}}/flights/orders'
                  headers:
                    - name: Accept
                      value: application/json
                response:
                  status: 200
                  statusText: OK
                  headers:
                    - name: Content-Type
                      value: application/json
                    - name: x-total-count
                      value: '128'
                  body:
                    type: json
                    data: |
                      [
                        {
                          "orderNumber": "1XGGJFT",
                          "status": "confirmed",
                          "flight": {
                            "origin": "JFK",
                            "destination": "LAX",
                            "flightNumber": "UA1234"
                          },
                          "fare": { "totalFare": 289.49, "currency": "USD" }
                        }
                      ]
              - name: 404 Not Found - unknown order
                description: An order_number that does not exist returns a 404.
                request:
                  method: GET
                  url: '{{baseUrl}}/flights/orders?order_number=ZZZZZZZ'
                  params:
                    - name: order_number
                      value: ZZZZZZZ
                      type: query
                response:
                  status: 404
                  statusText: Not Found
                  headers:
                    - name: Content-Type
                      value: application/json
                  body:
                    type: json
                    data: |
                      {
                        "error": "not_found",
                        "message": "No order found for order_number=ZZZZZZZ"
                      }
            docs: |
              # Get All Orders

              Retrieves all flight orders with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of order objects. The \`x-total-count\` header contains total orders.

              ### Order Object Structure

              \`\`\`json
              {
                "orderNumber": "ABC1234",
                "status": "confirmed",
                "flight": {
                  "origin": { "airportCode": "JFK", "city": "New York", "name": "John F. Kennedy Intl" },
                  "destination": { "airportCode": "LAX", "city": "Los Angeles", "name": "Los Angeles Intl" },
                  "departureTimeLocal": "2026-01-25T14:30",
                  "arrivalTimeLocal": "2026-01-25T17:45",
                  "flightNumber": "UA1234",
                  "aircraft": "Boeing 737",
                  "operatedBy": "United Airlines"
                },
                "passengers": [
                  { "firstName": "John", "lastName": "Smith", "email": "john.smith@example.com", "seatNumber": "12A" }
                ],
                "fare": { "baseFare": 199.99, "taxesAndFees": 89.50, "totalFare": 289.49, "currency": "USD" },
                "optionalServices": { "carryOnBag": true, "checkedBags": 1, "seatSelection": "standard", "priorityBoarding": false },
                "createdAt": "2026-01-10T09:30:00.000Z",
                "updatedAt": "2026-01-10T09:30:00.000Z"
              }
              \`\`\`

              ### Order Statuses

              - \`confirmed\` - Order is confirmed
              - \`pending\` - Order is awaiting confirmation
              - \`cancelled\` - Order has been cancelled

              ## Example

              \`GET /flights/orders\`
          - info:
              name: Get Order by Order Number
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/flights/orders?order_number={{orderNumber}}'
              params:
                - name: order_number
                  value: '{{orderNumber}}'
                  type: query
              auth: inherit
            runtime:
              variables:
                - name: orderNumber
                  value: 1XGGJFT
              scripts:
                - type: before-request
                  code: |
                    // Request "Get Order by Order Number" · pre-request (L3, innermost)
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
                    // Request · tests — asserts the full collection->folder->folder->request chain ran
                    test('multi-level execution chain captured', () => {
                      expect(bru.getVar('execChain')).to.contain('C0');
                    });
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Order by Order Number

              Retrieves a specific flight order by its 7-character alphanumeric order number.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`order_number\` | string | **Required.** 7-character alphanumeric order number (e.g., 1XGGJFT) |

              ## Response

              Returns an array containing the matching order (or empty if not found).

              ### Order Object

              - \`orderNumber\`: Unique 7-character identifier
              - \`status\`: Order status (\`confirmed\`, \`pending\`, or \`cancelled\`)
              - \`flight\`: Flight details (origin, destination, times, flight number, aircraft, operator)
              - \`passengers\`: Array of passengers with name, email, and seat number
              - \`fare\`: Pricing breakdown (baseFare, taxesAndFees, totalFare, currency)
              - \`optionalServices\`: Add-ons (carryOnBag, checkedBags, seatSelection, priorityBoarding)
              - \`createdAt\` / \`updatedAt\`: ISO timestamps

              ## Example

              \`GET /flights/orders?order_number=1XGGJFT\`
          - info:
              name: Get Orders - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/flights/orders?origin=LAX&destination=JFK&departure=2026-01-25&arrival=2026-01-25&page=1&per_page=20'
              params:
                - name: origin
                  value: LAX
                  type: query
                - name: destination
                  value: JFK
                  type: query
                - name: departure
                  value: '2026-01-25'
                  type: query
                - name: arrival
                  value: '2026-01-25'
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
              # Get Orders - Combined Filters

              Retrieves flight orders using multiple filters for precise search results.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`origin\` | string | Filter by origin airport code |
              | \`destination\` | string | Filter by destination airport code |
              | \`departure\` | string | Filter by departure date (\`yyyy-mm-dd\`) |
              | \`arrival\` | string | Filter by arrival date (\`yyyy-mm-dd\`) |
              | \`order_number\` | string | Filter by specific order number |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Airport codes are case-insensitive
              - Date filters match the date portion of departure/arrival times

              ## Response

              Returns an array of orders matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /flights/orders?origin=LAX&destination=JFK&departure=2026-01-25&arrival=2026-01-25&page=1&per_page=20\`
          - info:
              name: Get Orders - Filter by Origin
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/flights/orders?origin=SFB'
              params:
                - name: origin
                  value: SFB
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by Origin

              Retrieves flight orders filtered by origin airport.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`origin\` | string | **Required.** Origin airport code (e.g., SFB, JFK, LAX) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Airport Codes

              SFB (Orlando), LAS (Las Vegas), LAX (Los Angeles), JFK (New York), ORD (Chicago), DFW (Dallas), DEN (Denver), ATL (Atlanta), SEA (Seattle), MIA (Miami), PHX (Phoenix), IAH (Houston), BOS (Boston), SFO (San Francisco), MSP (Minneapolis), DTW (Detroit), PHL (Philadelphia), CLT (Charlotte), LGA (New York), BWI (Baltimore)

              ## Response

              Returns an array of orders for flights departing from the specified airport. The \`x-total-count\` header shows total matching orders.

              ## Example

              \`GET /flights/orders?origin=SFB\`
          - info:
              name: Get Orders - Filter by Status and Date
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/flights/orders?departure=2026-01-25&page=1&per_page=15'
              params:
                - name: departure
                  value: '2026-01-25'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '15'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by Status and Date

              Retrieves flight orders filtered by departure date with pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`departure\` | string | **Required.** Departure date in \`yyyy-mm-dd\` format |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - The departure filter matches the date portion of \`flight.departureTimeLocal\`
              - Orders are available for flights within 90 days from 2026-01-20
              - Order statuses: \`confirmed\`, \`pending\`, \`cancelled\`

              ## Response

              Returns an array of orders for flights on the specified departure date. The \`x-total-count\` header shows total matching orders.

              ## Example

              \`GET /flights/orders?departure=2026-01-25&page=1&per_page=15\`
      - info:
          name: shop
          type: folder
          seq: 1
        request:
          auth: inherit
        items:
          - info:
              name: All Flights
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/flights?page=1'
              params:
                - name: page
                  value: '1'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            examples:
              - name: 200 OK - first page of flights
                description: All available flights, paginated.
                request:
                  method: GET
                  url: '{{baseUrl}}/flights?page=1'
                  params:
                    - name: page
                      value: '1'
                      type: query
                response:
                  status: 200
                  statusText: OK
                  headers:
                    - name: Content-Type
                      value: application/json
                    - name: x-total-count
                      value: '256'
                  body:
                    type: json
                    data: |
                      [
                        {
                          "journey": {
                            "origin": "JFK",
                            "destination": "LAX",
                            "departureTimeLocal": "2026-01-25T14:30",
                            "stops": 0,
                            "operatedBy": "United Airlines"
                          },
                          "pricing": { "totalFare": 289.49, "fareType": "Standard", "currency": "USD" }
                        }
                      ]
            docs: |
              # All Flights

              Retrieves all available flights with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of flight objects. The \`x-total-count\` response header contains the total number of flights.

              ### Flight Object Structure

              Each flight contains:
              - \`journey\`: Route details (origin, destination, times, duration, stops, aircraft, operator)
              - \`pricing\`: Fare breakdown (baseFare, taxesAndFees, totalFare, fareType, currency)
              - \`optionalServices\`: Add-on pricing (carry-on, checked bags, seat selection, priority boarding)

              ## Example

              \`GET /flights?page=1\`
          - info:
              name: Get Flights - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/flights?origin=LAX&destination=JFK&departure=2026-01-25&page=1&per_page=20'
              params:
                - name: origin
                  value: LAX
                  type: query
                - name: destination
                  value: JFK
                  type: query
                - name: departure
                  value: '2026-01-25'
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
              # Get Flights - Combined Filters

              Retrieves flights using multiple filters simultaneously for precise search results.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`origin\` | string | Origin airport code (e.g., LAX) |
              | \`destination\` | string | Destination airport code (e.g., JFK) |
              | \`departure\` | string | Departure date in \`yyyy-mm-dd\` format |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Origin/destination are case-insensitive (converted to uppercase)
              - Departure date matches the date portion of \`departureTimeLocal\`

              ## Response

              Returns an array of flights matching all specified criteria. The \`x-total-count\` header shows total matching results.

              ## Example

              \`GET /flights?origin=LAX&destination=JFK&departure=2026-01-25&page=1&per_page=20\`
          - info:
              name: Get Flights - Filter by Departure Date
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/flights?departure=2026-01-25'
              params:
                - name: departure
                  value: '2026-01-25'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Flights - Filter by Departure Date

              Retrieves flights departing on a specific date.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`departure\` | string | **Required.** Departure date in \`yyyy-mm-dd\` format |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              The departure filter matches the date portion of \`departureTimeLocal\` field. Flights are available for dates within 90 days from 2026-01-20.

              ## Response

              Returns an array of flights departing on the specified date. The \`x-total-count\` header shows total matching results.

              ## Example

              \`GET /flights?departure=2026-01-25\`
          - info:
              name: Get Flights - Filter by Origin and Destination
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/flights?origin={{origin}}&destination={{destination}}'
              params:
                - name: origin
                  value: '{{origin}}'
                  type: query
                - name: destination
                  value: '{{destination}}'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Flights - Filter by Origin and Destination

              Retrieves flights for a specific route by filtering on both origin and destination airports.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`origin\` | string | **Required.** Origin airport code (e.g., SFB, JFK, LAX) |
              | \`destination\` | string | **Required.** Destination airport code |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Airport Codes

              SFB (Orlando), LAS (Las Vegas), LAX (Los Angeles), JFK (New York), ORD (Chicago), DFW (Dallas), DEN (Denver), ATL (Atlanta), SEA (Seattle), MIA (Miami), PHX (Phoenix), IAH (Houston), BOS (Boston), SFO (San Francisco), MSP (Minneapolis), DTW (Detroit), PHL (Philadelphia), CLT (Charlotte), LGA (New York), BWI (Baltimore)

              ## Response

              Returns an array of flights for the specified route. The \`x-total-count\` header shows total matching results.

              ## Example

              \`GET /flights?origin=SFB&destination=LAX\`
          - info:
              name: Get Flights - Filter by Origin
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/flights?origin={{origin}}'
              params:
                - name: origin
                  value: '{{origin}}'
                  type: query
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Flights - Filter by Origin

              Retrieves a list of flights filtered by the origin airport code.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`origin\` | string | **Required.** Origin airport code (e.g., JFK, LAX, SFB) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Airport Codes

              SFB (Orlando), LAS (Las Vegas), LAX (Los Angeles), JFK (New York), ORD (Chicago), DFW (Dallas), DEN (Denver), ATL (Atlanta), SEA (Seattle), MIA (Miami), PHX (Phoenix), IAH (Houston), BOS (Boston), SFO (San Francisco), MSP (Minneapolis), DTW (Detroit), PHL (Philadelphia), CLT (Charlotte), LGA (New York), BWI (Baltimore)

              ## Response

              Returns an array of flight objects. The \`x-total-count\` response header contains the total number of matching flights.

              ### Flight Object Structure

              \`\`\`json
              {
                "journey": {
                  "origin": { "airportCode": "JFK", "city": "New York", "name": "John F. Kennedy Intl" },
                  "destination": { "airportCode": "LAX", "city": "Los Angeles", "name": "Los Angeles Intl" },
                  "departureTimeLocal": "2026-01-25T14:30",
                  "arrivalTimeLocal": "2026-01-25T17:45",
                  "totalDurationMinutes": 315,
                  "durationMinutes": 315,
                  "stops": 0,
                  "aircraft": "Boeing 737",
                  "operatedBy": "United Airlines"
                },
                "pricing": {
                  "baseFare": 199.99,
                  "taxesAndFees": 89.50,
                  "totalFare": 289.49,
                  "fareType": "Standard",
                  "currency": "USD"
                },
                "optionalServices": {
                  "carryOnBag": { "price": 25, "per": "segment" },
                  "checkedBag": { "firstBag": 35, "secondBag": 45, "maxWeightLbs": 40 },
                  "seatSelection": { "standardSeat": 18, "legroomSeat": 42 },
                  "priorityBoarding": { "price": 15 }
                }
              }
              \`\`\`

              ## Example

              \`GET /flights?origin=JFK&page=1&per_page=10\`
          - info:
              name: Get Flights - Pagination
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/flights?page=2&per_page=25'
              params:
                - name: page
                  value: '2'
                  type: query
                - name: per_page
                  value: '25'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Flights - Pagination

              Demonstrates pagination controls for navigating through flight results.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number, 1-indexed (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Pagination Behavior

              - Page numbers start at 1
              - Maximum 50 items per page
              - Offset calculated as: \`(page - 1) * per_page\`
              - The \`x-total-count\` response header contains the total number of matching flights

              ## Response Headers

              | Header | Description |
              |--------|-------------|
              | \`x-total-count\` | Total number of flights (useful for calculating total pages) |

              ## Calculating Total Pages

              \`\`\`
              totalPages = Math.ceil(x-total-count / per_page)
              \`\`\`

              ## Example

              \`GET /flights?page=2&per_page=25\` - Returns items 26-50
  - info:
      name: hotels
      type: folder
      seq: 2
    request:
      auth: inherit
    items:
      - info:
          name: lookups
          type: folder
          seq: 2
        request:
          auth: inherit
        items:
          - info:
              name: Get Amenities
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/hotels/lookups/amenities'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Amenities

              Retrieves the list of hotel amenities.

              ## Response

              Returns an array of amenity names (strings).

              ### Available Amenities (15 total)

              WiFi, Pool, Gym, Spa, Restaurant, Bar, Room Service, Parking, Airport Shuttle, Business Center, Concierge, Laundry Service, Pet Friendly, Beach Access, Golf Course

              ## Example

              \`GET /hotels/lookups/amenities\`
          - info:
              name: Get Cities
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/hotels/lookups/cities'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Cities

              Retrieves the list of available cities for hotel bookings.

              ## Response

              Returns an array of city objects.

              ### City Object

              \`\`\`json
              {
                "code": "NYC",
                "name": "New York",
                "state": "NY",
                "country": "USA"
              }
              \`\`\`

              ### Available Cities (20 total)

              ORL (Orlando, FL), LAS (Las Vegas, NV), LAX (Los Angeles, CA), NYC (New York, NY), CHI (Chicago, IL), DFW (Dallas, TX), DEN (Denver, CO), ATL (Atlanta, GA), SEA (Seattle, WA), MIA (Miami, FL), PHX (Phoenix, AZ), HOU (Houston, TX), BOS (Boston, MA), SFO (San Francisco, CA), MSP (Minneapolis, MN), DET (Detroit, MI), PHL (Philadelphia, PA), CLT (Charlotte, NC), BAL (Baltimore, MD), NOL (New Orleans, LA)

              ## Example

              \`GET /hotels/lookups/cities\`
          - info:
              name: Get Hotel Chains
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/hotels/lookups/hotelChains'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotel Chains

              Retrieves the list of hotel chains.

              ## Response

              Returns an array of hotel chain names (strings).

              ### Available Hotel Chains (15 total)

              Marriott, Hilton, Hyatt, InterContinental, Sheraton, Holiday Inn, Best Western, Radisson, Wyndham, DoubleTree, Westin, Renaissance, Courtyard, Residence Inn, Embassy Suites

              ## Example

              \`GET /hotels/lookups/hotelChains\`
          - info:
              name: Get Property Types
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/hotels/lookups/propertyTypes'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Property Types

              Retrieves the list of property types.

              ## Response

              Returns an array of property type names (strings).

              ### Available Property Types (5 total)

              Hotel, Resort, Boutique Hotel, Extended Stay, Luxury Hotel

              ## Example

              \`GET /hotels/lookups/propertyTypes\`
          - info:
              name: Get Room Types
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/hotels/lookups/roomTypes'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Room Types

              Retrieves the list of available room types.

              ## Response

              Returns an array of room type names (strings).

              ### Available Room Types (12 total)

              Standard Room, Deluxe Room, Suite, Executive Suite, Junior Suite, King Room, Queen Room, Studio, Penthouse Suite, Family Room, Ocean View Room, City View Room

              ## Example

              \`GET /hotels/lookups/roomTypes\`
      - info:
          name: order
          type: folder
          seq: 3
        request:
          auth: inherit
        items:
          - info:
              name: Get All Orders
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/hotels/orders'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Orders

              Retrieves all hotel orders with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of order objects. The \`x-total-count\` header contains total orders.

              ### Order Object Structure

              Each order contains:
              - \`orderNumber\`: 7-character alphanumeric identifier
              - \`status\`: Order status (\`confirmed\`, \`pending\`, or \`cancelled\`)
              - \`hotel\`: Hotel details (name, chain, propertyType, starRating, location, amenities)
              - \`stay\`: Stay details (checkInDate, checkInTimeLocal, checkOutDate, checkOutTimeLocal, nights)
              - \`room\`: Room details (type, guests, rooms)
              - \`guests\`: Array of guest information (firstName, lastName, email)
              - \`rateSummary\`: Pricing breakdown (baseRate, totalNights, taxesAndFees, totalRate, currency)
              - \`optionalServices\`: Add-ons (breakfast, parking, wifi, spa)
              - \`createdAt\` / \`updatedAt\`: ISO timestamps

              ## Example

              \`GET /hotels/orders\`
          - info:
              name: Get Order by Order Number
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/hotels/orders?order_number=D3KDT9J'
              params:
                - name: order_number
                  value: D3KDT9J
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Order by Order Number

              Retrieves a specific hotel order by its 7-character alphanumeric order number.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`order_number\` | string | **Required.** 7-character alphanumeric order number (e.g., D3KDT9J) |

              ## Response

              Returns an array containing the matching order (or empty if not found).

              ## Example

              \`GET /hotels/orders?order_number=D3KDT9J\`
          - info:
              name: Get Orders - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/hotels/orders?city=NYC&check_in=2026-01-25&check_out=2026-01-28&page=1&per_page=20'
              params:
                - name: city
                  value: NYC
                  type: query
                - name: check_in
                  value: '2026-01-25'
                  type: query
                - name: check_out
                  value: '2026-01-28'
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
              # Get Orders - Combined Filters

              Retrieves hotel orders using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`city\` | string | Filter by city code |
              | \`check_in\` | string | Filter by check-in date (\`yyyy-mm-dd\`) |
              | \`check_out\` | string | Filter by check-out date (\`yyyy-mm-dd\`) |
              | \`order_number\` | string | Filter by specific order number |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - City codes are case-insensitive
              - Date filters match exact dates

              ## Response

              Returns an array of orders matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels/orders?city=NYC&check_in=2026-01-25&check_out=2026-01-28&page=1&per_page=20\`
          - info:
              name: Get Orders - Filter by Check-in Date
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/hotels/orders?check_in=2026-01-25&page=1&per_page=15'
              params:
                - name: check_in
                  value: '2026-01-25'
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '15'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by Check-in Date

              Retrieves hotel orders filtered by check-in date.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`check_in\` | string | **Required.** Check-in date in \`yyyy-mm-dd\` format |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - The check-in filter matches the exact date of \`stay.checkInDate\`
              - Orders are available for check-in dates within 90 days from 2026-01-20

              ## Response

              Returns an array of orders with the specified check-in date. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels/orders?check_in=2026-01-25&page=1&per_page=15\`
          - info:
              name: Get Orders - Filter by City
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/hotels/orders?city=ORL'
              params:
                - name: city
                  value: ORL
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by City

              Retrieves hotel orders filtered by city code.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`city\` | string | **Required.** City code (e.g., ORL, LAS, NYC) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of orders for hotels in the specified city. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels/orders?city=ORL\`
      - info:
          name: shop
          type: folder
          seq: 1
        request:
          auth: inherit
        items:
          - info:
              name: All Hotels
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/hotels'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # All Hotels

              Retrieves all available hotels with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of hotel objects. The \`x-total-count\` header contains total hotels.

              ### Hotel Object Structure

              Each hotel contains:
              - \`hotel\`: Hotel details (name, chain, propertyType, starRating, location, amenities)
              - \`stay\`: Stay details (checkInDate, checkInTimeLocal, checkOutDate, checkOutTimeLocal, nights)
              - \`room\`: Room details (type, guests, rooms)
              - \`pricing\`: Pricing breakdown (baseRate, totalNights, taxesAndFees, totalRate, currency)
              - \`optionalServices\`: Add-on pricing (breakfast, parking, wifi, spa)

              ## Example

              \`GET /hotels?page=1\`
          - info:
              name: Get Hotels - Combined Filters
              type: http
              seq: 7
            http:
              method: GET
              url: '{{baseUrl}}/hotels?city=NYC&check_in=2026-01-25&check_out=2026-01-28&guests=2&rooms=1&page=1&per_page=20'
              params:
                - name: city
                  value: NYC
                  type: query
                - name: check_in
                  value: '2026-01-25'
                  type: query
                - name: check_out
                  value: '2026-01-28'
                  type: query
                - name: guests
                  value: '2'
                  type: query
                - name: rooms
                  value: '1'
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
              # Get Hotels - Combined Filters

              Retrieves hotels using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`city\` | string | Filter by city code |
              | \`check_in\` | string | Filter by check-in date (\`yyyy-mm-dd\`) |
              | \`check_out\` | string | Filter by check-out date (\`yyyy-mm-dd\`) |
              | \`guests\` | integer | Filter by minimum number of guests |
              | \`rooms\` | integer | Filter by minimum number of rooms |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - City codes are case-insensitive
              - Guest/room filters use "greater than or equal" logic

              ## Response

              Returns an array of hotels matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels?city=NYC&check_in=2026-01-25&check_out=2026-01-28&guests=2&rooms=1&page=1&per_page=20\`
          - info:
              name: Get Hotels - Filter by Check-in Date
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/hotels?check_in=2026-03-30'
              params:
                - name: check_in
                  value: '2026-03-30'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotels - Filter by Check-in Date

              Retrieves hotels with a specific check-in date.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`check_in\` | string | **Required.** Check-in date in \`yyyy-mm-dd\` format |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - The check-in filter matches the exact date of \`stay.checkInDate\`
              - Hotels are available for dates within 90 days from 2026-01-20
              - Stay duration ranges from 1-7 nights

              ## Response

              Returns an array of hotels with the specified check-in date. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels?check_in=2026-03-30\`
          - info:
              name: Get Hotels - Filter by City and Dates
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/hotels?city=LAS&check_in=2026-01-25&check_out=2026-01-28'
              params:
                - name: city
                  value: LAS
                  type: query
                - name: check_in
                  value: '2026-01-25'
                  type: query
                - name: check_out
                  value: '2026-01-28'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotels - Filter by City and Dates

              Retrieves hotels for a specific city and date range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`city\` | string | **Required.** City code (e.g., LAS, NYC) |
              | \`check_in\` | string | **Required.** Check-in date (\`yyyy-mm-dd\`) |
              | \`check_out\` | string | **Required.** Check-out date (\`yyyy-mm-dd\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - City code matching is case-insensitive (converted to uppercase)
              - Check-in and check-out dates must match exactly
              - All filters are combined with AND logic

              ## Response

              Returns an array of hotels matching the city and dates. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels?city=LAS&check_in=2026-01-25&check_out=2026-01-28\`
          - info:
              name: Get Hotels - Filter by City
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/hotels?city=ORL'
              params:
                - name: city
                  value: ORL
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotels - Filter by City

              Retrieves hotels filtered by city code.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`city\` | string | **Required.** City code (e.g., ORL, LAS, NYC) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available City Codes (20 total)

              ORL (Orlando), LAS (Las Vegas), LAX (Los Angeles), NYC (New York), CHI (Chicago), DFW (Dallas), DEN (Denver), ATL (Atlanta), SEA (Seattle), MIA (Miami), PHX (Phoenix), HOU (Houston), BOS (Boston), SFO (San Francisco), MSP (Minneapolis), DET (Detroit), PHL (Philadelphia), CLT (Charlotte), BAL (Baltimore), NOL (New Orleans)

              ## Response

              Returns an array of hotels in the specified city. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels?city=ORL\`
          - info:
              name: Get Hotels - Filter by Guests and Rooms
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/hotels?guests=2&rooms=1'
              params:
                - name: guests
                  value: '2'
                  type: query
                - name: rooms
                  value: '1'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotels - Filter by Guests and Rooms

              Retrieves hotels that can accommodate the specified number of guests and rooms.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`guests\` | integer | Minimum number of guests (1-4) |
              | \`rooms\` | integer | Minimum number of rooms (1-3) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`guests\`: Returns hotels with \`room.guests >= guests\`
              - \`rooms\`: Returns hotels with \`room.rooms >= rooms\`
              - Both filters use "greater than or equal" logic

              ## Response

              Returns an array of hotels that can accommodate the specified capacity. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /hotels?guests=2&rooms=1\`
          - info:
              name: Get Hotels - Pagination
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/hotels?page=2&per_page=25'
              params:
                - name: page
                  value: '2'
                  type: query
                - name: per_page
                  value: '25'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Hotels - Pagination

              Demonstrates pagination controls for navigating through hotel results.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number, 1-indexed (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Pagination Behavior

              - Page numbers start at 1
              - Maximum 50 items per page
              - Offset calculated as: \`(page - 1) * per_page\`
              - The \`x-total-count\` response header contains the total number of matching hotels

              ## Example

              \`GET /hotels?page=2&per_page=25\` - Returns items 26-50
  - info:
      name: posts
      type: folder
      seq: 5
    request:
      auth: inherit
    items:
      - info:
          name: authors
          type: folder
          seq: 3
        request:
          auth: inherit
        items:
          - info:
              name: Get All Authors
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/posts/authors'
              auth: inherit
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("each author has id, name, and email", function() {
                      const body = res.getBody();
                      expect(Array.isArray(body)).to.equal(true);
                      body.forEach(function(author) {
                        expect(author).to.have.property("id");
                        expect(author).to.have.property("name");
                        expect(author).to.have.property("email");
                        expect(author.email).to.match(/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/);
                      });
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                  value: ''
                - expression: res.body.length
                  operator: gte
                  value: '1'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Authors

              Retrieves all blog authors with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of author objects. The \`x-total-count\` header contains total authors (50 total).

              ### Author Object Structure

              \`\`\`json
              {
                "id": "author_001",
                "name": "Sarah Johnson",
                "email": "sarah.johnson@example.com",
                "bio": "Software engineer passionate about web development.",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJohnson",
                "website": "https://sarahjohnson.dev",
                "postCount": 12,
                "createdAt": "2023-05-15T10:00:00.000Z"
              }
              \`\`\`

              ## Example

              \`GET /posts/authors\`
          - info:
              name: Get Authors - Filter by Date Range
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/posts/authors?created[gte]=2023-01-01&created[lte]=2023-12-31&page=1&per_page=20'
              params:
                - name: created[gte]
                  value: '2023-01-01'
                  type: query
                - name: created[lte]
                  value: '2023-12-31'
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
              # Get Authors - Filter by Date Range

              Retrieves authors created within a date range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`created[gte]\` | string | **Required.** Start date (ISO 8601 format, e.g., \`2023-01-01\`) |
              | \`created[lte]\` | string | **Required.** End date (ISO 8601 format, e.g., \`2023-12-31\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`created[gte]\`: Returns authors created on or after this date
              - \`created[lte]\`: Returns authors created on or before this date
              - Author creation dates span the last 3 years from 2023-01-01

              ## Response

              Returns an array of authors created within the date range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/authors?created[gte]=2023-01-01&created[lte]=2023-12-31&page=1&per_page=20\`
          - info:
              name: Get Authors - Filter by Email
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/posts/authors?email=sarah.johnson@example.com'
              params:
                - name: email
                  value: sarah.johnson@example.com
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Authors - Filter by Email

              Retrieves authors filtered by exact email address match.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`email\` | string | **Required.** Exact email address (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - Email matching is case-insensitive
              - Returns authors with exact email match

              ## Response

              Returns an array of authors matching the email. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/authors?email=sarah.johnson@example.com\`
      - info:
          name: comments
          type: folder
          seq: 2
        request:
          auth: inherit
        items:
          - info:
              name: Get All Comments
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/posts/comments'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Comments

              Retrieves all comments with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of comment objects. The \`x-total-count\` header contains total comments.

              ### Comment Object Structure

              \`\`\`json
              {
                "id": "comment_00001",
                "post": "post_0001",
                "author": "author_001",
                "authorName": "John Smith",
                "authorEmail": "john.smith@example.com",
                "body": "Great article!",
                "status": "approved",
                "parent": null,
                "createdAt": "2024-01-20T14:30:00.000Z",
                "likes": 5
              }
              \`\`\`

              **Note:** Comments can be replies (have a \`parent\` comment ID) or top-level comments (\`parent\` is null).

              ### Comment Statuses

              - \`approved\` - Approved comment (80% of comments)
              - \`pending\` - Pending moderation
              - \`spam\` - Marked as spam
              - \`deleted\` - Deleted comment

              ## Example

              \`GET /posts/comments\`
          - info:
              name: Get Comments - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/posts/comments?post=post_0001&status=approved&created[gte]=2024-01-01&page=1&per_page=20'
              params:
                - name: post
                  value: post_0001
                  type: query
                - name: status
                  value: approved
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
              # Get Comments - Combined Filters

              Retrieves comments using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`post\` | string | Filter by post ID |
              | \`author\` | string | Filter by author ID |
              | \`status\` | string | Filter by comment status |
              | \`created[gte]\` | string | Filter by creation date (greater than or equal, ISO 8601) |
              | \`created[lte]\` | string | Filter by creation date (less than or equal, ISO 8601) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Status matching is case-insensitive
              - Comments are created up to 90 days after post publication

              ## Response

              Returns an array of comments matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/comments?post=post_0001&status=approved&created[gte]=2024-01-01&page=1&per_page=20\`
          - info:
              name: Get Comments - Filter by Author
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/posts/comments?author=author_001'
              params:
                - name: author
                  value: author_001
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Comments - Filter by Author

              Retrieves comments by a specific author (30% are from registered authors, 70% from anonymous commenters).

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`author\` | string | **Required.** Author ID (e.g., \`author_001\`) or null for anonymous comments |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of comments by the specified author. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/comments?author=author_001\`
          - info:
              name: Get Comments - Filter by Post
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/posts/comments?post=post_0003'
              params:
                - name: post
                  value: post_0003
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Comments - Filter by Post

              Retrieves comments for a specific post.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`post\` | string | **Required.** Post ID (e.g., \`post_0003\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of comments for the specified post. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/comments?post=post_0003\`
          - info:
              name: Get Comments - Filter by Status
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/posts/comments?status=approved'
              params:
                - name: status
                  value: approved
                  type: query
              auth: inherit
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("every returned comment has status 'approved'", function() {
                      const body = res.getBody();
                      expect(Array.isArray(body)).to.equal(true);
                      body.forEach(function(comment) {
                        expect(comment.status).to.equal("approved");
                      });
                    });
                    test("response time is under 5 seconds", function() {
                      expect(res.getResponseTime()).to.be.below(5000);
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                  value: ''
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Comments - Filter by Status

              Retrieves comments filtered by moderation status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Comment status (\`approved\`, \`pending\`, \`spam\`, or \`deleted\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`approved\` - Approved comment
              - \`pending\` - Pending moderation
              - \`spam\` - Marked as spam
              - \`deleted\` - Deleted comment

              ## Response

              Returns an array of comments with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts/comments?status=approved\`
      - info:
          name: lookups
          type: folder
          seq: 4
        request:
          auth: inherit
        items:
          - info:
              name: Get Categories
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/posts/lookups/categories'
              auth: inherit
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("categories list is non-empty", function() {
                      const body = res.getBody();
                      expect(Array.isArray(body)).to.equal(true);
                      expect(body.length).to.be.greaterThan(0);
                    });
                    test("each category is a non-empty string", function() {
                      const body = res.getBody();
                      body.forEach(function(category) {
                        expect(typeof category).to.equal("string");
                        expect(category.length).to.be.greaterThan(0);
                      });
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                  value: ''
                - expression: res.body.length
                  operator: gte
                  value: '1'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Categories

              Retrieves the list of post categories.

              ## Response

              Returns an array of category names (strings).

              ### Available Categories (15 total)

              Programming, Technology, Web Development, DevOps, Design, Mobile Development, Data Science, AI/ML, Security, Cloud Computing, Database, Frontend, Backend, Full Stack, Testing

              ## Example

              \`GET /posts/lookups/categories\`
          - info:
              name: Get Comment Statuses
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/posts/lookups/commentStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Comment Statuses

              Retrieves the list of comment statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Comment Statuses (4 total)

              - \`approved\` - Approved comment
              - \`pending\` - Pending moderation
              - \`spam\` - Marked as spam
              - \`deleted\` - Deleted comment

              ## Example

              \`GET /posts/lookups/commentStatuses\`
          - info:
              name: Get Post Statuses
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/posts/lookups/postStatuses'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Post Statuses

              Retrieves the list of post statuses.

              ## Response

              Returns an array of status names (strings).

              ### Available Post Statuses (4 total)

              - \`published\` - Published post
              - \`draft\` - Draft post
              - \`archived\` - Archived post
              - \`scheduled\` - Scheduled for future publication

              ## Example

              \`GET /posts/lookups/postStatuses\`
          - info:
              name: Get Tags
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/posts/lookups/tags'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Tags

              Retrieves the list of post tags.

              ## Response

              Returns an array of tag names (strings).

              ### Available Tags (43 total)

              javascript, nodejs, python, react, vue, angular, typescript, java, go, rust, php, ruby, swift, kotlin, docker, kubernetes, aws, azure, gcp, mongodb, postgresql, mysql, redis, graphql, rest, api, microservices, serverless, ci-cd, git, linux, bash, html, css, sass, webpack, testing, jest, cypress, agile, scrum, tutorial, guide

              ## Example

              \`GET /posts/lookups/tags\`
      - info:
          name: posts
          type: folder
          seq: 1
        request:
          auth: inherit
        items:
          - info:
              name: Get All Posts
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/posts'
              auth: inherit
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("response is a non-empty array of posts", function() {
                      const body = res.getBody();
                      expect(Array.isArray(body)).to.equal(true);
                      expect(body.length).to.be.greaterThan(0);
                    });
                    test("each post has required fields", function() {
                      const body = res.getBody();
                      const first = body[0];
                      expect(first).to.have.property("id");
                      expect(first).to.have.property("title");
                      expect(first).to.have.property("author");
                      expect(first).to.have.property("status");
                    });
                    test("response time is under 5 seconds", function() {
                      expect(res.getResponseTime()).to.be.below(5000);
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                  value: ''
                - expression: res.body.length
                  operator: gte
                  value: '1'
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Posts

              Retrieves all blog posts with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of post objects. The \`x-total-count\` header contains total posts.

              ### Post Object Structure

              \`\`\`json
              {
                "id": "post_0001",
                "title": "Getting Started with React",
                "slug": "getting-started-with-react",
                "body": "Post content...",
                "excerpt": "Brief excerpt...",
                "author": "author_001",
                "authorName": "John Smith",
                "category": "Programming",
                "tags": ["javascript", "react"],
                "status": "published",
                "publishedAt": "2024-01-15T10:30:00.000Z",
                "createdAt": "2024-01-15T09:00:00.000Z",
                "updatedAt": "2024-01-20T14:20:00.000Z",
                "views": 1250,
                "likes": 45,
                "readingTime": 5,
                "featuredImage": "https://picsum.photos/800/400?random=1"
              }
              \`\`\`

              ### Post Statuses

              - \`published\` - Published post (75% of posts)
              - \`draft\` - Draft post
              - \`archived\` - Archived post
              - \`scheduled\` - Scheduled for future publication

              ## Example

              \`GET /posts\`
          - info:
              name: Get Posts - Combined Filters
              type: http
              seq: 8
            http:
              method: GET
              url: '{{baseUrl}}/posts?category=Programming&tag=javascript&status=published&min_views=1000&page=1&per_page=20'
              params:
                - name: category
                  value: Programming
                  type: query
                - name: tag
                  value: javascript
                  type: query
                - name: status
                  value: published
                  type: query
                - name: min_views
                  value: '1000'
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
              # Get Posts - Combined Filters

              Retrieves posts using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`author\` | string | Filter by author ID |
              | \`category\` | string | Filter by category |
              | \`tag\` | string | Filter by tag |
              | \`status\` | string | Filter by post status |
              | \`published_at[gte]\` | string | Filter by published date (greater than or equal, ISO 8601) |
              | \`published_at[lte]\` | string | Filter by published date (less than or equal, ISO 8601) |
              | \`min_views\` | integer | Minimum number of views |
              | \`search\` | string | Search in title and content |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Category, tag, and status matching is case-insensitive
              - \`min_views\` filters posts with \`views >= min_views\`

              ## Response

              Returns an array of posts matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?category=Programming&tag=javascript&status=published&min_views=1000&page=1&per_page=20\`
          - info:
              name: Get Posts - Filter by Author
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/posts?author=author_001'
              params:
                - name: author
                  value: author_001
                  type: query
              auth: inherit
            runtime:
              scripts:
                - type: tests
                  code: |-
                    test("every returned post belongs to the requested author", function() {
                      const body = res.getBody();
                      expect(Array.isArray(body)).to.equal(true);
                      body.forEach(function(post) {
                        expect(post.author).to.equal("author_001");
                      });
                    });
                    test("response time is under 5 seconds", function() {
                      expect(res.getResponseTime()).to.be.below(5000);
                    });
              assertions:
                - expression: res.status
                  operator: eq
                  value: '200'
                - expression: res.body
                  operator: isArray
                  value: ''
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Posts - Filter by Author

              Retrieves posts filtered by author ID.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`author\` | string | **Required.** Author ID (e.g., \`author_001\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of posts by the specified author. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?author=author_001\`
          - info:
              name: Get Posts - Filter by Category
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/posts?category=Programming'
              params:
                - name: category
                  value: Programming
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Posts - Filter by Category

              Retrieves posts filtered by category.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`category\` | string | **Required.** Category name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Categories (15 total)

              Programming, Technology, Web Development, DevOps, Design, Mobile Development, Data Science, AI/ML, Security, Cloud Computing, Database, Frontend, Backend, Full Stack, Testing

              ## Response

              Returns an array of posts in the specified category. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?category=Programming\`
          - info:
              name: Get Posts - Filter by Date Range
              type: http
              seq: 7
            http:
              method: GET
              url: '{{baseUrl}}/posts?published_at[gte]=2024-01-01&published_at[lte]=2024-12-31&page=1&per_page=20'
              params:
                - name: published_at[gte]
                  value: '2024-01-01'
                  type: query
                - name: published_at[lte]
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
              # Get Posts - Filter by Date Range

              Retrieves posts published within a date range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`published_at[gte]\` | string | **Required.** Start date (ISO 8601 format, e.g., \`2024-01-01\`) |
              | \`published_at[lte]\` | string | **Required.** End date (ISO 8601 format, e.g., \`2024-12-31\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`published_at[gte]\`: Returns posts published on or after this date
              - \`published_at[lte]\`: Returns posts published on or before this date
              - Only returns posts with a \`publishedAt\` value (excludes drafts)
              - Posts span the last 3 years from 2023-01-01

              ## Response

              Returns an array of posts published within the date range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?published_at[gte]=2024-01-01&published_at[lte]=2024-12-31&page=1&per_page=20\`
          - info:
              name: Get Posts - Filter by Status
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/posts?status=published'
              params:
                - name: status
                  value: published
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Posts - Filter by Status

              Retrieves posts filtered by publication status.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`status\` | string | **Required.** Post status (\`published\`, \`draft\`, \`archived\`, or \`scheduled\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Statuses

              - \`published\` - Published post
              - \`draft\` - Draft post
              - \`archived\` - Archived post
              - \`scheduled\` - Scheduled for future publication

              ## Response

              Returns an array of posts with the specified status. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?status=published\`
          - info:
              name: Get Posts - Filter by Tag
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/posts?tag=javascript'
              params:
                - name: tag
                  value: javascript
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Posts - Filter by Tag

              Retrieves posts filtered by tag.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`tag\` | string | **Required.** Tag name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - Tag matching is case-insensitive
              - Returns posts that include the specified tag in their \`tags\` array
              - Posts typically have 2-5 tags

              ## Response

              Returns an array of posts tagged with the specified tag. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?tag=javascript\`
          - info:
              name: Get Posts - Search
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/posts?search=javascript'
              params:
                - name: search
                  value: javascript
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Posts - Search

              Searches posts by title and content.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`search\` | string | **Required.** Search query (searches in title and body) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Search Behavior

              - Searches are case-insensitive
              - Matches posts where the search term appears in either \`title\` or \`body\`
              - Uses substring matching (not full-text search)

              ## Response

              Returns an array of posts matching the search query. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /posts?search=javascript\`
  - info:
      name: songs
      type: folder
      seq: 3
    request:
      auth: inherit
    items:
      - info:
          name: lookups
          type: folder
          seq: 3
        request:
          auth: inherit
        items:
          - info:
              name: Get Artists
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/songs/lookups/artists'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Artists

              Retrieves the list of available artists.

              ## Response

              Returns an array of artist names (strings).

              ### Available Artists (20 total)

              Taylor Swift, The Weeknd, Billie Eilish, Drake, Ariana Grande, Ed Sheeran, Post Malone, Dua Lipa, The Beatles, Queen, Michael Jackson, Elvis Presley, Madonna, Prince, David Bowie, Bob Dylan, Led Zeppelin, Pink Floyd, The Rolling Stones, Nirvana

              ## Example

              \`GET /songs/lookups/artists\`
          - info:
              name: Get Formats
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/songs/lookups/formats'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Formats

              Retrieves the list of available song formats.

              ## Response

              Returns an array of format names (strings).

              ### Available Formats (5 total)

              - \`Digital\` - Digital download
              - \`CD\` - Compact disc
              - \`Vinyl\` - Vinyl record
              - \`Cassette\` - Cassette tape
              - \`Streaming\` - Streaming format

              ## Example

              \`GET /songs/lookups/formats\`
          - info:
              name: Get Genres
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/songs/lookups/genres'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Genres

              Retrieves the list of music genres.

              ## Response

              Returns an array of genre names (strings).

              ### Available Genres (16 total)

              Pop, Rock, Hip-Hop, R&B, Country, Electronic, Jazz, Classical, Blues, Reggae, Folk, Metal, Punk, Indie, Latin, World

              ## Example

              \`GET /songs/lookups/genres\`
          - info:
              name: Get Record Labels
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/songs/lookups/recordLabels'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Record Labels

              Retrieves the list of record labels.

              ## Response

              Returns an array of record label names (strings).

              ### Available Record Labels (12 total)

              Universal Music, Sony Music, Warner Music, EMI Records, Atlantic Records, RCA Records, Columbia Records, Interscope Records, Republic Records, Capitol Records, Island Records, Def Jam Recordings

              ## Example

              \`GET /songs/lookups/recordLabels\`
      - info:
          name: order
          type: folder
          seq: 2
        request:
          auth: inherit
        items:
          - info:
              name: Get All Orders
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/songs/orders'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get All Orders

              Retrieves all song orders with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of order objects. The \`x-total-count\` header contains total orders.

              ### Order Object Structure

              \`\`\`json
              {
                "orderNumber": "A3B7C9D",
                "status": "confirmed",
                "song": {
                  "title": "Love Heart",
                  "artist": "Taylor Swift",
                  "album": "Midnight Dreams",
                  "genre": "Pop",
                  "duration": "3:45",
                  "releaseDate": "2023-05-15",
                  "format": "Digital"
                },
                "purchase": {
                  "type": "song",
                  "quantity": 1,
                  "format": "Digital"
                },
                "customer": {
                  "firstName": "John",
                  "lastName": "Smith",
                  "email": "john.smith@example.com"
                },
                "pricing": {
                  "unitPrice": 1.29,
                  "quantity": 1,
                  "subtotal": 1.29,
                  "tax": 0.10,
                  "total": 1.39,
                  "currency": "USD"
                },
                "createdAt": "2023-05-20T14:30:00.000Z",
                "updatedAt": "2023-05-20T14:30:00.000Z"
              }
              \`\`\`

              ### Order Statuses

              - \`confirmed\` - Order is confirmed
              - \`pending\` - Order is pending
              - \`cancelled\` - Order has been cancelled

              ### Purchase Types

              - \`song\` - Single song purchase (70% of orders)
              - \`album\` - Album purchase (30% of orders)

              ## Example

              \`GET /songs/orders\`
          - info:
              name: Get Order by Order Number
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/songs/orders?order_number=A3B7C9D'
              params:
                - name: order_number
                  value: A3B7C9D
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Order by Order Number

              Retrieves a specific song order by its 7-character alphanumeric order number.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`order_number\` | string | **Required.** 7-character alphanumeric order number (e.g., A3B7C9D) |

              ## Response

              Returns an array containing the matching order (or empty if not found).

              ## Example

              \`GET /songs/orders?order_number=A3B7C9D\`
          - info:
              name: Get Orders - Combined Filters
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/songs/orders?artist=Drake&genre=Hip-Hop&purchase_type=song&page=1&per_page=20'
              params:
                - name: artist
                  value: Drake
                  type: query
                - name: genre
                  value: Hip-Hop
                  type: query
                - name: purchase_type
                  value: song
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
              # Get Orders - Combined Filters

              Retrieves song orders using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`artist\` | string | Filter by artist name |
              | \`genre\` | string | Filter by genre |
              | \`order_number\` | string | Filter by specific order number |
              | \`purchase_type\` | string | Filter by purchase type (\`song\` or \`album\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Artist and genre matching is case-insensitive
              - Purchase type matching is case-insensitive

              ## Response

              Returns an array of orders matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs/orders?artist=Drake&genre=Hip-Hop&purchase_type=song&page=1&per_page=20\`
          - info:
              name: Get Orders - Filter by Artist
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/songs/orders?artist=The Beatles'
              params:
                - name: artist
                  value: The Beatles
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by Artist

              Retrieves song orders filtered by artist name.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`artist\` | string | **Required.** Artist name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of orders for songs by the specified artist. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs/orders?artist=The Beatles\`
          - info:
              name: Get Orders - Filter by Purchase Type
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/songs/orders?purchase_type=album&page=1&per_page=15'
              params:
                - name: purchase_type
                  value: album
                  type: query
                - name: page
                  value: '1'
                  type: query
                - name: per_page
                  value: '15'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Orders - Filter by Purchase Type

              Retrieves song orders filtered by purchase type.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`purchase_type\` | string | **Required.** Purchase type (\`song\` or \`album\`) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Purchase Types

              - \`song\` - Single song purchase
              - \`album\` - Album purchase

              ## Response

              Returns an array of orders with the specified purchase type. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs/orders?purchase_type=album&page=1&per_page=15\`
      - info:
          name: shop
          type: folder
          seq: 1
        request:
          auth: inherit
        items:
          - info:
              name: All Songs
              type: http
              seq: 1
            http:
              method: GET
              url: '{{baseUrl}}/songs'
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # All Songs

              Retrieves all available songs with default pagination.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Response

              Returns an array of song objects. The \`x-total-count\` header contains total songs.

              ### Song Object Structure

              \`\`\`json
              {
                "song": {
                  "title": "Love Heart",
                  "artist": "Taylor Swift",
                  "album": "Midnight Dreams",
                  "genre": "Pop",
                  "duration": "3:45",
                  "durationSeconds": 225,
                  "trackNumber": 1,
                  "releaseDate": "2023-05-15",
                  "recordLabel": "Universal Music",
                  "format": "Digital"
                },
                "pricing": {
                  "songPrice": 1.29,
                  "albumPrice": 12.99,
                  "currency": "USD"
                },
                "metadata": {
                  "rating": 4.5,
                  "playCount": 1250000,
                  "isExplicit": false
                }
              }
              \`\`\`

              ## Example

              \`GET /songs\`
          - info:
              name: Get Songs - Combined Filters
              type: http
              seq: 6
            http:
              method: GET
              url: '{{baseUrl}}/songs?genre=Rock&format=Digital&min_rating=4.0&max_price=1.50&page=1&per_page=20'
              params:
                - name: genre
                  value: Rock
                  type: query
                - name: format
                  value: Digital
                  type: query
                - name: min_rating
                  value: '4.0'
                  type: query
                - name: max_price
                  value: '1.50'
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
              # Get Songs - Combined Filters

              Retrieves songs using multiple filters simultaneously.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`artist\` | string | Filter by artist name |
              | \`genre\` | string | Filter by genre |
              | \`album\` | string | Filter by album name |
              | \`format\` | string | Filter by format |
              | \`min_rating\` | number | Minimum rating (0-5) |
              | \`max_price\` | number | Maximum price in USD |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - All filters are combined with AND logic
              - Artist, genre, album, and format matching is case-insensitive
              - Rating and price filters use "greater than or equal" and "less than or equal" logic respectively

              ## Response

              Returns an array of songs matching all criteria. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs?genre=Rock&format=Digital&min_rating=4.0&max_price=1.50&page=1&per_page=20\`
          - info:
              name: Get Songs - Filter by Artist
              type: http
              seq: 2
            http:
              method: GET
              url: '{{baseUrl}}/songs?artist=Taylor Swift'
              params:
                - name: artist
                  value: Taylor Swift
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Songs - Filter by Artist

              Retrieves songs filtered by artist name.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`artist\` | string | **Required.** Artist name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - Artist matching is case-insensitive
              - Returns songs by the specified artist

              ## Response

              Returns an array of songs by the specified artist. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs?artist=Taylor Swift\`
          - info:
              name: Get Songs - Filter by Format
              type: http
              seq: 4
            http:
              method: GET
              url: '{{baseUrl}}/songs?format=Digital'
              params:
                - name: format
                  value: Digital
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Songs - Filter by Format

              Retrieves songs filtered by format.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`format\` | string | **Required.** Format name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Formats (5 total)

              - \`Digital\` - Digital download
              - \`CD\` - Compact disc
              - \`Vinyl\` - Vinyl record
              - \`Cassette\` - Cassette tape
              - \`Streaming\` - Streaming format

              ## Response

              Returns an array of songs in the specified format. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs?format=Digital\`
          - info:
              name: Get Songs - Filter by Genre
              type: http
              seq: 3
            http:
              method: GET
              url: '{{baseUrl}}/songs?genre=Pop'
              params:
                - name: genre
                  value: Pop
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Songs - Filter by Genre

              Retrieves songs filtered by genre.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`genre\` | string | **Required.** Genre name (case-insensitive) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Available Genres (16 total)

              Pop, Rock, Hip-Hop, R&B, Country, Electronic, Jazz, Classical, Blues, Reggae, Folk, Metal, Punk, Indie, Latin, World

              ## Response

              Returns an array of songs in the specified genre. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs?genre=Pop\`
          - info:
              name: Get Songs - Filter by Rating and Price
              type: http
              seq: 5
            http:
              method: GET
              url: '{{baseUrl}}/songs?min_rating=4.0&max_price=1.50'
              params:
                - name: min_rating
                  value: '4.0'
                  type: query
                - name: max_price
                  value: '1.50'
                  type: query
              auth: inherit
            settings:
              encodeUrl: true
              timeout: 0
              followRedirects: true
              maxRedirects: 5
            docs: |
              # Get Songs - Filter by Rating and Price

              Retrieves songs filtered by rating and price range.

              ## Query Parameters

              | Parameter | Type | Description |
              |-----------|------|-------------|
              | \`min_rating\` | number | Minimum rating (0-5, e.g., 4.0) |
              | \`max_price\` | number | Maximum price in USD (e.g., 1.50) |
              | \`page\` | integer | Page number (default: 1) |
              | \`per_page\` | integer | Items per page (default: 10, max: 50) |

              ## Filter Behavior

              - \`min_rating\`: Returns songs with \`metadata.rating >= min_rating\`
              - \`max_price\`: Returns songs with \`pricing.songPrice <= max_price\`
              - Song prices range from $0.99 to $1.99
              - Ratings range from 3.0 to 5.0

              ## Response

              Returns an array of songs within the rating and price range. The \`x-total-count\` header shows total matches.

              ## Example

              \`GET /songs?min_rating=4.0&max_price=1.50\`
bundled: true
extensions:
  bruno:
    exportedAt: '2026-06-18T10:00:57.825Z'
    exportedUsing: Bruno
`;
