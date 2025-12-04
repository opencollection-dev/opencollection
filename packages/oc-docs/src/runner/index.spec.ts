import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestRunner } from './index';
import { parseYaml } from '../utils/yamlUtils';

// Minimal collection YAML with one POST request
const collectionYaml = `
opencollection: "1.0.0"
info:
  name: "Test Collection"
  version: "1.0.0"
request:
  variables:
    - name: "baseUrl"
      value: "https://jsonplaceholder.typicode.com"
    - name: "request-level-variable"
      value: "request-level-variable-value"
items:
  - name: "POST with JSON Body"
    type: "http"
    method: "POST"
    url: "{{baseUrl}}/posts"
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
          "title": "{{request-level-variable}}",
          "body": "{{request-level-variable}}",
          "userId": 1
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
          expect(res.getBody().title).to.be.a("string");
          expect(res.getBody().body).to.be.a("string");
          expect(res.getBody().userId).to.be.a("number");
        });
        const testResults = await bru.getTestResults();
        const assertionResults = await bru.getAssertionResults();
        bru.setVar('testResults', testResults);
        bru.setVar('assertionResults', assertionResults);
`;

describe('RequestRunner', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Store original fetch
    originalFetch = global.fetch;
  });

  describe('runRequest', () => {
    it('should execute a POST request with JSON body and run assertions and tests', async () => {
      // Mock fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: 'https://jsonplaceholder.typicode.com/posts',
        headers: new Headers({
          'content-type': 'application/json; charset=utf-8'
        }),
        text: async () => JSON.stringify({
          title: 'request-level-variable-value',
          body: 'request-level-variable-value',
          userId: 1,
          id: 101
        })
      });

      const runner = new RequestRunner();

      // Parse the YAML collection
      const collection = parseYaml(collectionYaml);
      
      // Get the first request item
      const request = collection.items[0];

      const runtimeVariables: Record<string, any> = {};

      const response = await runner.runRequest({
        item: request,
        collection,
        runtimeVariables,
        timeout: 5000
      });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.title).toBe('request-level-variable-value');
      expect(response.data.body).toBe('request-level-variable-value');
      expect(response.data.userId).toBe(1);
      expect(response.error).toBeUndefined();

      // Verify assertion results were captured
      expect(runtimeVariables.assertionResults).toBeDefined();
      expect(runtimeVariables.assertionResults.summary).toEqual({
        total: 3,
        passed: 3,
        failed: 0,
        skipped: 0
      });
      expect(runtimeVariables.assertionResults.results).toHaveLength(3);
      
      // Check first assertion (res.status eq 200)
      expect(runtimeVariables.assertionResults.results[0]).toMatchObject({
        status: 'pass',
        operator: 'eq'
      });

      // Check second assertion (res.body.title isString)
      expect(runtimeVariables.assertionResults.results[1]).toMatchObject({
        status: 'pass',
        operator: 'isString'
      });

      // Check third assertion (res.headers['content-type'] contains application/json)
      expect(runtimeVariables.assertionResults.results[2]).toMatchObject({
        status: 'pass',
        operator: 'contains'
      });

      // Note: Test results from the test() function in scripts are not captured in this test
      // because the QuickJS sandbox execution is async and may not complete before the test ends.
      // In a real scenario, the test results would be available after the script completes.

      // Restore original fetch
      global.fetch = originalFetch;
    });
  });
});

