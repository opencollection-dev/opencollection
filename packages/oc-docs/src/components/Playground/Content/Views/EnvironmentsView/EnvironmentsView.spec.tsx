import { describe, it, expect } from 'vitest';
import { variableToRow, rowToVariable } from './EnvironmentsView';

const roundTrip = (variable: any, index = 0) => rowToVariable(variableToRow(variable, index)) as any;

describe('EnvironmentsView variable round-trip', () => {
  it('keeps a plain string variable', () => {
    const out = roundTrip({ name: 'host', value: 'http://localhost:8081' });
    expect(out.name).toBe('host');
    expect(out.value).toBe('http://localhost:8081');
  });

  it('preserves a variant array instead of flattening it to the selected value', () => {
    const apiBase = {
      name: 'api_base',
      value: [
        { title: 'dev', value: 'https://dev.api.local', selected: true },
        { title: 'prod', value: 'https://prod.api.local' }
      ]
    };
    const out = roundTrip(apiBase);
    expect(Array.isArray(out.value)).toBe(true);
    expect(out.value).toEqual(apiBase.value);
  });

  it('preserves a typed value wrapper instead of flattening to a bare string', () => {
    const out = roundTrip({ name: 'timeout', value: { type: 'number', data: '30' } });
    expect(out.value).toEqual({ type: 'number', data: '30' });
  });

  it('never writes a value onto a secret with no value (no injected empty string) and keeps its type', () => {
    const out = roundTrip({ name: 'bearer_auth_token', secret: true, type: 'string' });
    expect(out.secret).toBe(true);
    expect(out.type).toBe('string');
    expect('value' in out).toBe(false);
  });

  it('keeps an entered secret value so the request can resolve it on send', () => {
    const editedRow = {
      id: 'var-0',
      name: 'bearer_auth_token',
      value: 'real-token',
      enabled: true,
      secret: true,
      source: { name: 'bearer_auth_token', secret: true, type: 'string' }
    };
    const out = rowToVariable(editedRow as any) as any;
    expect(out.secret).toBe(true);
    expect(out.value).toBe('real-token');
  });
});
