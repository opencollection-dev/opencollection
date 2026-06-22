import { describe, it, expect } from 'vitest';
import { getPreRequestVars, getPostResponseVars } from './requestVars';

describe('requestVars', () => {
  it('reads pre-request variables and flattens typed values', () => {
    const item: any = {
      runtime: { variables: [{ name: 'x', value: '1' }, { name: 'y', value: { type: 'string', data: 'z' } }] }
    };
    expect(getPreRequestVars(item)).toEqual([
      { name: 'x', value: '1', disabled: undefined },
      { name: 'y', value: 'z', disabled: undefined }
    ]);
  });

  it('reads post-response captures from set-variable actions', () => {
    const item: any = {
      runtime: {
        actions: [
          {
            type: 'set-variable',
            phase: 'after-response',
            selector: { expression: 'res.body.token', method: 'jsonq' },
            variable: { name: 'authToken', scope: 'environment' }
          }
        ]
      }
    };
    expect(getPostResponseVars(item)).toEqual([
      { name: 'authToken', expression: 'res.body.token', scope: 'environment', disabled: undefined }
    ]);
  });
});
