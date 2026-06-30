import { describe, it, expect } from 'vitest';
import { generateCurlCommand, generateJavaScriptCode, generatePythonCode } from './codeSnippets';

describe('codeSnippets', () => {
  it('generates cURL with headers + JSON body + content-type, keeping {{templates}} intact', () => {
    const curl = generateCurlCommand({
      method: 'post',
      url: '{{baseUrl}}/login',
      headers: [{ name: 'Accept', value: 'application/json' }],
      body: { type: 'json', data: '{"a":1}' } as any
    });
    expect(curl).toContain('curl --request POST');
    expect(curl).toContain('{{baseUrl}}/login');
    expect(curl).toContain("--header 'Accept: application/json'");
    expect(curl).toContain("--header 'Content-Type: application/json'");
    expect(curl).toContain("--data '{\"a\":1}'");
  });

  it('injects a bearer Authorization header', () => {
    const curl = generateCurlCommand({ method: 'get', url: '/x', auth: { type: 'bearer', token: 'tkn' } as any });
    expect(curl).toContain("--header 'Authorization: Bearer tkn'");
  });

  it('comments non-derivable auth instead of emitting a wrong header', () => {
    const curl = generateCurlCommand({ method: 'get', url: '/x', auth: { type: 'awsv4' } as any });
    expect(curl).toContain('# auth: awsv4');
  });

  it('serializes form-urlencoded and multipart bodies', () => {
    const urlencoded = generateCurlCommand({
      method: 'post',
      url: '/x',
      body: { type: 'form-urlencoded', data: [{ name: 'a', value: '1' }] } as any
    });
    expect(urlencoded).toContain('--data a=1');

    const multipart = generateCurlCommand({
      method: 'post',
      url: '/x',
      body: { type: 'multipart-form', data: [{ name: 'f', type: 'file', value: '/x.pdf' }] } as any
    });
    expect(multipart).toContain("--form f='@/x.pdf'");
  });

  it('generates JavaScript (fetch) and Python (requests) with the body', () => {
    const input = { method: 'post', url: '/x', body: { type: 'json', data: '{"a":1}' } as any };
    expect(generateJavaScriptCode(input)).toContain('fetch(');
    expect(generateJavaScriptCode(input)).toContain('body: JSON.stringify');
    expect(generatePythonCode(input)).toContain('requests.post(');
    expect(generatePythonCode(input)).toContain('json=payload');
  });
});
