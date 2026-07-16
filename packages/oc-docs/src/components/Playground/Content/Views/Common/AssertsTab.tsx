import React from 'react';
import { IconCaretDown } from '@tabler/icons';
import type { Assertion } from '@opencollection/types/common/assertions';
import KeyValueTable, { type KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
import MenuDropdown from '../../../../../ui/MenuDropdown';

/**
 * Assertion operators based on Bruno's implementation
 *
 * Comparison operators:
 * - eq: equal to
 * - neq: not equal to
 * - gt: greater than
 * - gte: greater than or equal to
 * - lt: less than
 * - lte: less than or equal to
 *
 * Collection operators:
 * - in: in
 * - notIn: not in
 * - contains: contains
 * - notContains: not contains
 *
 * String operators:
 * - matches: matches (regex)
 * - notMatches: not matches (regex)
 * - startsWith: starts with
 * - endsWith: ends with
 *
 * Type checking operators (unary):
 * - isEmpty: is empty
 * - isNotEmpty: is not empty
 * - isNull: is null
 * - isUndefined: is undefined
 * - isDefined: is defined
 * - isTruthy: is truthy
 * - isFalsy: is falsy
 * - isJson: is json
 * - isNumber: is number
 * - isString: is string
 * - isBoolean: is boolean
 * - isArray: is array
 *
 * Other operators:
 * - length: length
 * - between: between
 */

const ASSERTION_OPERATORS = [
  { value: 'eq', label: 'equals' },
  { value: 'neq', label: 'not equals' },
  { value: 'gt', label: 'greater than' },
  { value: 'gte', label: 'greater than or equal' },
  { value: 'lt', label: 'less than' },
  { value: 'lte', label: 'less than or equal' },
  { value: 'in', label: 'in' },
  { value: 'notIn', label: 'not in' },
  { value: 'contains', label: 'contains' },
  { value: 'notContains', label: 'not contains' },
  { value: 'length', label: 'length' },
  { value: 'matches', label: 'matches' },
  { value: 'notMatches', label: 'not matches' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
  { value: 'between', label: 'between' },
  { value: 'isEmpty', label: 'is empty' },
  { value: 'isNotEmpty', label: 'is not empty' },
  { value: 'isNull', label: 'is null' },
  { value: 'isUndefined', label: 'is undefined' },
  { value: 'isDefined', label: 'is defined' },
  { value: 'isTruthy', label: 'is truthy' },
  { value: 'isFalsy', label: 'is falsy' },
  { value: 'isJson', label: 'is json' },
  { value: 'isNumber', label: 'is number' },
  { value: 'isString', label: 'is string' },
  { value: 'isBoolean', label: 'is boolean' },
  { value: 'isArray', label: 'is array' }
];

const UNARY_OPERATORS = [
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

interface AssertsTabProps {
  assertions: Assertion[];
  onAssertionsChange: (assertions: Assertion[]) => void;
  title?: string;
  description?: string;
}

export const AssertsTab: React.FC<AssertsTabProps> = ({
  assertions,
  onAssertionsChange,
  title = 'Assertions',
  description
}) => {
  // Convert assertions to KeyValueRow format with operator column
  const assertionsData: KeyValueRow[] = (assertions || []).map((assertion, index) => {
    return {
      id: `assertion-${index}`,
      name: assertion.expression || '',
      value: assertion.value || '',
      operator: assertion.operator || 'eq',
      enabled: !assertion.disabled
    };
  });

  const handleAssertionsChange = (rows: KeyValueRow[]) => {
    const updatedAssertions: Assertion[] = rows.map((row) => {
      const isUnary = UNARY_OPERATORS.includes(row.operator);

      return {
        expression: row.name, // Required field
        operator: row.operator, // Required field
        value: isUnary ? undefined : row.value,
        disabled: !row.enabled
      };
    });
    onAssertionsChange(updatedAssertions);
  };

  const handleOperatorChange = (index: number, newOperator: string) => {
    const updatedRows = [...assertionsData];
    updatedRows[index] = { ...updatedRows[index], operator: newOperator };

    // If switching to unary operator, clear the value
    if (UNARY_OPERATORS.includes(newOperator)) {
      updatedRows[index].value = '';
    }

    handleAssertionsChange(updatedRows);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        {description && (
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </span>
        )}
      </div>
      <KeyValueTable
        data={assertionsData}
        onChange={handleAssertionsChange}
        keyPlaceholder="Expression (e.g., res.status)"
        valuePlaceholder="Expected value"
        showEnabled={true}
        additionalColumns={[
          {
            key: 'operator',
            label: 'Operator',
            render: (row, index) => {
              // Default to the first operator when a row has none selected yet.
              const currentOperator = row.operator || ASSERTION_OPERATORS[0].value;
              const currentLabel =
                ASSERTION_OPERATORS.find((op) => op.value === currentOperator)?.label ?? ASSERTION_OPERATORS[0].label;
              return (
                <MenuDropdown
                  selectedItemId={currentOperator}
                  placement="bottom-start"
                  items={ASSERTION_OPERATORS.map((op) => ({
                    id: op.value,
                    label: op.label,
                    onClick: () => handleOperatorChange(index, op.value)
                  }))}
                >
                  <button
                    type="button"
                    aria-label="Operator"
                    data-testid="assertion-operator-select"
                    className="inline-flex items-center justify-between"
                    style={{
                      width: '100%',
                      gap: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8125rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{currentLabel}</span>
                    <IconCaretDown
                      size={14}
                      strokeWidth={2}
                      style={{ color: 'var(--oc-colors-text-muted)', flexShrink: 0 }}
                    />
                  </button>
                </MenuDropdown>
              );
            }
          }
        ]}
      />
      <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        Use expressions like <code>res.status</code>, <code>res.body.id</code>, or{' '}
        <code>res.headers['content-type']</code>
      </div>
    </div>
  );
};

export default AssertsTab;
