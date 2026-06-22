import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Assertion } from '@opencollection/types/common/assertions';
import { getRequestAssertions } from './schemaHelpers';

const OPERATOR_LABELS: Record<string, string> = {
  eq: 'equals',
  neq: 'does not equal',
  gt: 'greater than',
  gte: 'greater than or equal to',
  lt: 'less than',
  lte: 'less than or equal to',
  in: 'in',
  notIn: 'not in',
  contains: 'contains',
  notContains: 'does not contain',
  length: 'has length',
  matches: 'matches',
  notMatches: 'does not match',
  startsWith: 'starts with',
  endsWith: 'ends with',
  between: 'between',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  isNull: 'is null',
  isUndefined: 'is undefined',
  isDefined: 'is defined',
  isTruthy: 'is truthy',
  isFalsy: 'is falsy',
  isJson: 'is JSON',
  isNumber: 'is a number',
  isString: 'is a string',
  isBoolean: 'is a boolean',
  isArray: 'is an array'
};

const UNARY_OPERATORS = new Set([
  'isEmpty', 'isNotEmpty', 'isNull', 'isUndefined', 'isDefined', 'isTruthy', 'isFalsy',
  'isJson', 'isNumber', 'isString', 'isBoolean', 'isArray'
]);

export const humanizeOperator = (operator: string): string => OPERATOR_LABELS[operator] || operator;
export const isUnaryOperator = (operator: string): boolean => UNARY_OPERATORS.has(operator);

export interface AssertionRow {
  level: 'request' | 'folder' | 'collection';
  expression: string;
  operatorLabel: string;
  value?: string;
  isUnary: boolean;
  disabled?: boolean;
}

/**
 * Collect a request's assertions as display rows. `RequestDefaults` carries no
 * assertions, so only request-level asserts exist (the parameter is kept for
 * forward-compatibility). This is a static view — no pass/fail.
 */
export const collectAssertions = (item: HttpRequest): AssertionRow[] =>
  getRequestAssertions(item).map((assertion: Assertion) => {
    const unary = isUnaryOperator(assertion.operator);
    return {
      level: 'request',
      expression: assertion.expression,
      operatorLabel: humanizeOperator(assertion.operator),
      value: unary ? undefined : assertion.value,
      isUnary: unary,
      disabled: assertion.disabled
    };
  });
