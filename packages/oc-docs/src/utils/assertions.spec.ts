import { describe, it, expect } from 'vitest';
import { humanizeOperator, isUnaryOperator, collectAssertions } from './assertions';

describe('assertions', () => {
  it('humanizes operators, falling back to the raw operator', () => {
    expect(humanizeOperator('eq')).toBe('equals');
    expect(humanizeOperator('isString')).toBe('is a string');
    expect(humanizeOperator('weird')).toBe('weird');
  });

  it('identifies unary operators', () => {
    expect(isUnaryOperator('isString')).toBe(true);
    expect(isUnaryOperator('eq')).toBe(false);
  });

  it('collects assertions, hiding the value for unary operators', () => {
    const item: any = {
      runtime: {
        assertions: [
          { expression: 'res.status', operator: 'eq', value: '200' },
          { expression: 'res.body.token', operator: 'isString', value: 'x' }
        ]
      }
    };
    const rows = collectAssertions(item);
    expect(rows[0]).toMatchObject({ expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false, level: 'request' });
    expect(rows[1]).toMatchObject({ operatorLabel: 'is a string', value: undefined, isUnary: true });
  });
});
