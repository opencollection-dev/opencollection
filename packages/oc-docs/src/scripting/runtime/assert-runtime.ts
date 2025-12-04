import * as chai from 'chai';
import type { Assertion } from '@opencollection/types/common/assertions';
import Bru from '../utils/bru';
import BrunoRequest from '../utils/bruno-request';
import BrunoResponse from '../utils/bruno-response';
import { executeQuickJsVm } from '../sandbox/quickjs';

const { expect } = chai;

export interface AssertionResult {
  uid: string;
  expression: string;
  operator: string;
  value?: string;
  status: 'pass' | 'fail';
  error?: string;
}

const isUnaryOperator = (operator: string) => {
  const unaryOperators = [
    'isEmpty',
    'isNotEmpty',
    'isNull',
    'isUndefined',
    'isDefined',
    'isTruthy',
    'isFalsy',
    'isJson',
    'isNumber',
    'isString',
    'isBoolean',
    'isArray'
  ];

  return unaryOperators.includes(operator);
};

const evaluateRhsOperand = (rhsOperand: string | undefined, operator: string, context: any) => {
  if (isUnaryOperator(operator) || !rhsOperand) {
    return undefined;
  }

  // For 'in' and 'notIn' operators, parse comma-separated values
  if (operator === 'in' || operator === 'notIn') {
    let values = rhsOperand;
    // Remove brackets if present
    if (values.startsWith('[') && values.endsWith(']')) {
      values = values.substring(1, values.length - 1);
    }

    return values.split(',').map((v) =>
      executeQuickJsVm({
        script: v.trim(),
        context,
        scriptType: 'template-literal'
      })
    );
  }

  // For 'between' operator, parse two comma-separated values
  if (operator === 'between') {
    const [lhs, rhs] = rhsOperand.split(',').map((v) =>
      executeQuickJsVm({
        script: v.trim(),
        context,
        scriptType: 'template-literal'
      })
    );
    return [lhs, rhs];
  }

  // For 'matches' and 'notMatches', remove slashes if present
  if (operator === 'matches' || operator === 'notMatches') {
    let pattern = rhsOperand;
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      pattern = pattern.substring(1, pattern.length - 1);
    }
    return pattern;
  }

  // For all other operators, evaluate as template literal
  return executeQuickJsVm({
    script: rhsOperand,
    context,
    scriptType: 'template-literal'
  });
};

const generateUid = () => {
  return `assert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export class AssertRuntime {
  runAssertions(
    assertions: Assertion[],
    request: any,
    response: any,
    variables: any
  ): AssertionResult[] {
    const enabledAssertions = assertions.filter((a) => !a.disabled);
    if (!enabledAssertions.length) {
      return [];
    }

    // Extract variables from the nested structure
    const {
      environmentVariables = {},
      runtimeVariables = {},
      processEnvVars = {},
      collectionVariables = {},
      folderVariables = {},
      requestVariables = {},
      globalEnvironmentVariables = {}
    } = variables;

    // Create Bru instance
    const bru = new Bru({
      collectionPath: '',
      collectionName: '',
      variables: {
        environmentVariables,
        runtimeVariables,
        globalEnvironmentVariables
      }
    });

    // Create request and response wrappers
    const req = new BrunoRequest(request);
    const res = new BrunoResponse(response);

    // Build context for expression evaluation
    const bruContext = {
      bru,
      req,
      res
    };

    const context = {
      ...globalEnvironmentVariables,
      ...collectionVariables,
      ...environmentVariables,
      ...folderVariables,
      ...requestVariables,
      ...runtimeVariables,
      ...processEnvVars,
      ...bruContext
    };

    const assertionResults: AssertionResult[] = [];

    // Run each assertion
    for (const assertion of enabledAssertions) {
      const expression = assertion.expression;
      const operator = assertion.operator;
      const rhsOperand = assertion.value;

      try {
        // Evaluate LHS expression
        const lhs = executeQuickJsVm({
          script: expression,
          context,
          scriptType: 'expression'
        });

        // Evaluate RHS operand
        const rhs = evaluateRhsOperand(rhsOperand, operator, context);

        // Perform assertion based on operator
        switch (operator) {
          case 'eq':
          case 'equals':
            expect(lhs).to.equal(rhs);
            break;
          case 'neq':
          case 'notEquals':
            expect(lhs).to.not.equal(rhs);
            break;
          case 'gt':
          case 'greaterThan':
            expect(lhs).to.be.greaterThan(rhs);
            break;
          case 'gte':
          case 'greaterThanOrEqual':
            expect(lhs).to.be.greaterThanOrEqual(rhs);
            break;
          case 'lt':
          case 'lessThan':
            expect(lhs).to.be.lessThan(rhs);
            break;
          case 'lte':
          case 'lessThanOrEqual':
            expect(lhs).to.be.lessThanOrEqual(rhs);
            break;
          case 'in':
            expect(lhs).to.be.oneOf(rhs);
            break;
          case 'notIn':
            expect(lhs).to.not.be.oneOf(rhs);
            break;
          case 'contains':
            expect(lhs).to.include(rhs);
            break;
          case 'notContains':
            expect(lhs).to.not.include(rhs);
            break;
          case 'length':
            expect(lhs).to.have.lengthOf(rhs);
            break;
          case 'matches':
            expect(lhs).to.match(new RegExp(rhs));
            break;
          case 'notMatches':
            expect(lhs).to.not.match(new RegExp(rhs));
            break;
          case 'startsWith':
            if (typeof lhs !== 'string') {
              throw new Error('startsWith expects a string');
            }
            expect(lhs.startsWith(rhs)).to.be.true;
            break;
          case 'endsWith':
            if (typeof lhs !== 'string') {
              throw new Error('endsWith expects a string');
            }
            expect(lhs.endsWith(rhs)).to.be.true;
            break;
          case 'between':
            const [min, max] = rhs;
            expect(lhs).to.be.within(min, max);
            break;
          case 'isEmpty':
            expect(lhs).to.be.empty;
            break;
          case 'isNotEmpty':
            expect(lhs).to.not.be.empty;
            break;
          case 'isNull':
            expect(lhs).to.be.null;
            break;
          case 'isUndefined':
            expect(lhs).to.be.undefined;
            break;
          case 'isDefined':
            expect(lhs).to.not.be.undefined;
            break;
          case 'isTruthy':
            expect(lhs).to.be.true;
            break;
          case 'isFalsy':
            expect(lhs).to.be.false;
            break;
          case 'isJson':
            try {
              JSON.parse(typeof lhs === 'string' ? lhs : JSON.stringify(lhs));
              expect(true).to.be.true;
            } catch {
              throw new Error('Expected value to be valid JSON');
            }
            break;
          case 'isNumber':
            expect(lhs).to.be.a('number');
            break;
          case 'isString':
            expect(lhs).to.be.a('string');
            break;
          case 'isBoolean':
            expect(lhs).to.be.a('boolean');
            break;
          case 'isArray':
            expect(lhs).to.be.a('array');
            break;
          default:
            // Default to equality check
            expect(lhs).to.equal(rhs);
            break;
        }

        assertionResults.push({
          uid: generateUid(),
          expression,
          operator,
          value: rhsOperand,
          status: 'pass'
        });
      } catch (err) {
        assertionResults.push({
          uid: generateUid(),
          expression,
          operator,
          value: rhsOperand,
          status: 'fail',
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    return assertionResults;
  }
}

export default AssertRuntime;

