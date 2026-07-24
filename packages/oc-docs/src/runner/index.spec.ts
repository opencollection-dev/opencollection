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

    it('should strip JSON comments from body before sending', async () => {
      // Mock fetch to capture what body was sent
      let sentBody: string | undefined;
      global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        sentBody = init.body as string;
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          url: 'https://example.com/api',
          headers: new Headers({
            'content-type': 'application/json'
          }),
          text: async () => JSON.stringify({ success: true })
        });
      });

      // Test RequestExecutor directly — this is where stripJsonComments is applied
      const { RequestExecutor } = await import('./RequestExecutor');
      const executor = new RequestExecutor();

      const requestWithComments: any = {
        http: {
          method: 'POST',
          url: 'https://example.com/api',
          headers: [
            { name: 'Content-Type', value: 'application/json' }
          ],
          body: {
            type: 'json',
            data: '{\n  "filters": {\n    "estado": "A",\n    // This comment should be stripped\n    "valor": "N"\n  }\n}'
          }
        }
      };

      await executor.executeRequest(requestWithComments, { timeout: 5000 });

      // The body sent should be valid JSON (no comments)
      expect(sentBody).toBeDefined();
      expect(() => JSON.parse(sentBody!)).not.toThrow();

      // The comment should have been stripped
      expect(sentBody).not.toContain('//');
      expect(sentBody).not.toContain('This comment should be stripped');

      // The actual data should still be there
      const parsed = JSON.parse(sentBody!);
      expect(parsed.filters.estado).toBe('A');
      expect(parsed.filters.valor).toBe('N');

      global.fetch = originalFetch;
    });

    it('should handle trailing commas left after stripping comments', async () => {
      let sentBody: string | undefined;
      global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        sentBody = init.body as string;
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          url: 'https://example.com/api',
          headers: new Headers({ 'content-type': 'application/json' }),
          text: async () => JSON.stringify({ success: true })
        });
      });

      const { RequestExecutor } = await import('./RequestExecutor');
      const executor = new RequestExecutor();

      const requestWithTrailingComma: any = {
        http: {
          method: 'POST',
          url: 'https://example.com/api',
          headers: [{ name: 'Content-Type', value: 'application/json' }],
          body: {
            type: 'json',
            data: '{\n  "a": 1,\n  // trailing comment\n}'
          }
        }
      };

      await executor.executeRequest(requestWithTrailingComma, { timeout: 5000 });

      expect(sentBody).toBeDefined();
      expect(() => JSON.parse(sentBody!)).not.toThrow();

      const parsed = JSON.parse(sentBody!);
      expect(parsed.a).toBe(1);

      global.fetch = originalFetch;
    });

    it('sends multipart text fields, excludes disabled, and omits file fields', async () => {
      let sentBody: FormData | undefined;
      global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        sentBody = init.body as FormData;
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          url: 'https://example.com/upload',
          headers: new Headers({ 'content-type': 'application/json' }),
          text: async () => JSON.stringify({ success: true })
        });
      });

      const { RequestExecutor } = await import('./RequestExecutor');
      const executor = new RequestExecutor();

      const multipartRequest: any = {
        http: {
          method: 'POST',
          url: 'https://example.com/upload',
          body: {
            type: 'multipart-form',
            data: [
              { name: 'file', type: 'file', value: '/path/to/document.pdf' },
              { name: 'description', type: 'text', value: 'Quarterly report' },
              { name: 'tags', type: 'text', value: 'report,quarterly' },
              { name: 'debug', type: 'text', value: 'true', disabled: true }
            ]
          }
        }
      };

      await executor.executeRequest(multipartRequest, { timeout: 5000 });

      expect(sentBody).toBeInstanceOf(FormData);
      expect(sentBody!.get('description')).toBe('Quarterly report');
      expect(sentBody!.get('tags')).toBe('report,quarterly');
      expect(sentBody!.has('file')).toBe(false);   // file field omitted
      expect(sentBody!.has('debug')).toBe(false);   // disabled field excluded

      global.fetch = originalFetch;
    });

    it('sends no body for a file/binary request', async () => {
      let sentBody: BodyInit | null | undefined;
      global.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        sentBody = init.body;
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          url: 'https://example.com/upload',
          headers: new Headers({ 'content-type': 'application/json' }),
          text: async () => JSON.stringify({ success: true })
        });
      });

      const { RequestExecutor } = await import('./RequestExecutor');
      const executor = new RequestExecutor();

      const fileRequest: any = {
        http: {
          method: 'POST',
          url: 'https://example.com/upload',
          body: {
            type: 'file',
            data: [{ filePath: '/path/to/document.pdf', contentType: 'application/pdf', selected: true }]
          }
        }
      };

      await executor.executeRequest(fileRequest, { timeout: 5000 });

      expect(sentBody == null).toBe(true);   // no body sent

      global.fetch = originalFetch;
    });

    describe("inherited auth reaches the wire", () => {
      const run = async (yaml: string, path: number[]) => {
        let captured: { url?: string; headers?: Record<string, string> } = {};
        global.fetch = vi
          .fn()
          .mockImplementation((url: string, init: RequestInit) => {
            captured = { url, headers: init.headers as Record<string, string> };
            return Promise.resolve({
              ok: true,
              status: 200,
              statusText: "OK",
              url,
              headers: new Headers({ "content-type": "application/json" }),
              text: async () => JSON.stringify({ ok: true }),
            });
          });
        const collection = parseYaml(yaml);
        let item = collection;
        for (const idx of path) item = (item.items ?? [])[idx];
        await new RequestRunner().runRequest({
          item,
          collection,
          runtimeVariables: {},
          timeout: 5000,
        });
        global.fetch = originalFetch;
        return captured;
      };

      it("applies a collection-level bearer to an inheriting request, interpolating the token var", async () => {
        const captured = await run(
          `
opencollection: "1.0.0"
info:
  name: "Auth Collection"
request:
  variables:
    - name: "apiToken"
      value: "secret-abc"
  auth:
    type: "bearer"
    token: "{{apiToken}}"
items:
  - name: "Inherited Bearer"
    type: "http"
    method: "GET"
    url: "https://api.example.com/me"
    auth: inherit
`,
          [0],
        );
        expect(captured.headers?.["Authorization"]).toBe("Bearer secret-abc");
      });

      it("applies a folder-level api key (query placement) to an inheriting request", async () => {
        const captured = await run(
          `
opencollection: "1.0.0"
info:
  name: "Auth Collection"
items:
  - name: "Folder A"
    type: "folder"
    request:
      auth:
        type: "apikey"
        key: "api_key"
        value: "k-123"
        placement: "query"
    items:
      - name: "Inherited ApiKey"
        type: "http"
        method: "GET"
        url: "https://api.example.com/data"
        auth: inherit
`,
          [0, 0],
        );
        expect(captured.url).toContain("api_key=k-123");
      });

      it("prefers the closest folder auth over the collection for an inheriting request", async () => {
        const captured = await run(
          `
opencollection: "1.0.0"
info:
  name: "Auth Collection"
request:
  auth:
    type: "bearer"
    token: "collection-token"
items:
  - name: "Folder A"
    type: "folder"
    request:
      auth:
        type: "bearer"
        token: "folder-token"
    items:
      - name: "Inherited Bearer"
        type: "http"
        method: "GET"
        url: "https://api.example.com/me"
        auth: inherit
`,
          [0, 0],
        );
        expect(captured.headers?.["Authorization"]).toBe("Bearer folder-token");
      });

      it("sends No Auth when a No-Auth folder blocks the collection auth", async () => {
        // A folder that configured No Auth is represented by an absent `auth` field (canonical
        // OpenCollection has no 'none' string); it blocks the parent's auth for an inheriting child.
        const captured = await run(
          `
opencollection: "1.0.0"
info:
  name: "Auth Collection"
request:
  auth:
    type: "bearer"
    token: "collection-token"
items:
  - name: "Folder A"
    type: "folder"
    request:
      headers:
        - name: "X-From-Folder"
          value: "1"
    items:
      - name: "Inheriting Request"
        type: "http"
        method: "GET"
        url: "https://api.example.com/me"
        auth: inherit
`,
          [0, 0],
        );
        expect(captured.headers?.["Authorization"]).toBeUndefined();
        expect(captured.headers?.["X-From-Folder"]).toBe("1"); // folder headers still merge
      });
    });

  });
});
