import { describe, it, expect } from 'vitest';
import ScriptRuntime from './script-runtime';

describe('ScriptRuntime', () => {
  it('should handle script execution', async () => {
    const runtime = new ScriptRuntime();

    let environmentVariables = {
        "env_var": "env_var_value"
    };

    let runtimeVariables = {
      "runtime_var": "runtime_var_value"
    };
    
    const mockRequest = {
      url: 'https://echo.usebruno.com',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      data: { message: 'success' }
    };

    const options = {
      script: `
        // check if the 'req' api works
        await test('req.getUrl()', () => {
          const url = req.getUrl();
          expect(url).to.eql('https://echo.usebruno.com');
        });

        // check if the 'res' api works
        await test('res.getStatus()', () => {
          const status = res.getStatus();
          expect(status).to.eql(200);
        });

        // check if the 'bru' api works
        // check if the 'runtime' variables get/set api works
        await test('bru.getVar', () => {
          const runtimeVar = bru.getVar('runtime_var');
          expect(runtimeVar).to.eql('runtime_var_value');
        });
        await test('bru.setVar', () => {
          bru.setVar('runtime_var', 'runtime_var_updated');
          const runtimeVar = bru.getVar('runtime_var');
          expect(runtimeVar).to.eql('runtime_var_updated');
        });

        // check if the 'env' variables get/set api works
        await test('bru.getEnvVar', () => {
          const envVar = bru.getEnvVar('env_var');
          expect(envVar).to.eql('env_var_value');
        });
        await test('bru.setEnvVar', () => {
          bru.setEnvVar('env_var', 'env_var_updated');
          const envVar = bru.getEnvVar('env_var');
          expect(envVar).to.eql('env_var_updated');
        });
        
        const testResults = await bru.getTestResults();
        bru.setVar('test_results', testResults);
      `,
      request: mockRequest,
      response: mockResponse,
      collectionName: 'test-collection',
      collectionPath: '/test/path',
      variables: {
        environmentVariables,
        runtimeVariables
      }
    };

    // This should not throw an error and will return the bru object
    const bru = await runtime.runScript(options);
    expect(bru).toBeDefined();

    expect(environmentVariables).to.eql({ "env_var": "env_var_updated" });
    expect(runtimeVariables).to.eql({ 
      "runtime_var": "runtime_var_updated",
      "test_results": {
        summary: { total: 6, passed: 6, failed: 0, skipped: 0 },
        results: [
          { status: 'pass', description: 'req.getUrl()' },
          { status: 'pass', description: 'res.getStatus()' },
          { status: 'pass', description: 'bru.getVar' },
          { status: 'pass', description: 'bru.setVar' },
          { status: 'pass', description: 'bru.getEnvVar' },
          { status: 'pass', description: 'bru.setEnvVar' }
        ]
      }
    });
  });
});
