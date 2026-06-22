import { describe, it, expect } from 'vitest';
import { generateCurlCommand, generateJavaScriptCode, generatePythonCode } from './codegen';

describe('codegen', () => {
  it('generates cURL with headers + JSON body + content-type', () => {
    const curl = generateCurlCommand({
      method: 'post',
      url: '{{baseUrl}}/login',
      headers: [{ name: 'Accept', value: 'application/json' }],
      body: { type: 'json', data: '{"a":1}' } as any
    });
    expect(curl).toContain("curl -X POST '{{baseUrl}}/login'");
    expect(curl).toContain("-H 'Accept: application/json'");
    expect(curl).toContain("-H 'Content-Type: application/json'");
    expect(curl).toContain("-d '{\"a\":1}'");
  });

  it('injects a bearer Authorization header', () => {
    const curl = generateCurlCommand({ method: 'get', url: '/x', auth: { type: 'bearer', token: 'tkn' } as any });
    expect(curl).toContain("-H 'Authorization: Bearer tkn'");
  });

  it('comments non-derivable auth instead of emitting a wrong header', () => {
    const curl = generateCurlCommand({ method: 'get', url: '/x', auth: { type: 'awsv4' } as any });
    expect(curl).toContain('# auth: awsv4');
  });

  it('serializes form-urlencoded and multipart bodies', () => {
    const curl = generateCurlCommand({
      method: 'post',
      url: '/x',
      body: { type: 'form-urlencoded', data: [{ name: 'a', value: '1' }] } as any
    });
    expect(curl).toContain("--data-urlencode 'a=1'");

    const multipart = generateCurlCommand({
      method: 'post',
      url: '/x',
      body: { type: 'multipart-form', data: [{ name: 'f', type: 'file', value: '/x.pdf' }] } as any
    });
    expect(multipart).toContain("-F 'f=@/x.pdf'");
  });

  it('generates JavaScript and Python with the body', () => {
    const input = { method: 'post', url: '/x', body: { type: 'json', data: '{"a":1}' } as any };
    expect(generateJavaScriptCode(input)).toContain("fetch('/x'");
    expect(generateJavaScriptCode(input)).toContain('body:');
    expect(generatePythonCode(input)).toContain('requests.post(');
    expect(generatePythonCode(input)).toContain('data=');
  });
});
