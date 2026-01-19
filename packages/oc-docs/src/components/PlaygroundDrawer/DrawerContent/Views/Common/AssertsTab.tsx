import React, { useMemo, useCallback } from 'react';
import type { Assertion } from '@opencollection/types/common/assertions';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';

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

interface AssertionRow extends EditableTableRow {
  expression: string;
  operator: string;
  value: string;
  enabled: boolean;
}

interface AssertsTabProps {
  assertions: Assertion[];
  onAssertionsChange: (assertions: Assertion[]) => void;
  title?: string;
  description?: string;
}

const generateUid = () => `assertion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const AssertsTab: React.FC<AssertsTabProps> = ({
  assertions,
  onAssertionsChange,
  title = "Assertions",
  description
}) => {
  const assertionsData: AssertionRow[] = useMemo(() => {
    return (assertions || []).map((assertion) => ({
      uid: (assertion as any).uid || generateUid(),
      expression: assertion.expression || '',
      operator: assertion.operator || 'eq',
      value: assertion.value || '',
      enabled: !assertion.disabled
    }));
  }, [assertions]);

  const handleAssertionsChange = useCallback((rows: AssertionRow[]) => {
    const updatedAssertions = rows.map(row => {
      const isUnary = UNARY_OPERATORS.includes(row.operator);

      return {
        uid: row.uid,
        expression: row.expression,
        operator: row.operator,
        value: isUnary ? undefined : row.value,
        disabled: !row.enabled
      };
    });
    onAssertionsChange(updatedAssertions as Assertion[]);
  }, [onAssertionsChange]);

  const columns: EditableTableColumn<AssertionRow>[] = useMemo(() => [
    {
      key: 'expression',
      name: 'Expression',
      isKeyField: true,
      placeholder: 'e.g., res.status',
      width: '35%'
    },
    {
      key: 'operator',
      name: 'Operator',
      width: '150px',
      render: ({ row, value, onChange }) => (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            fontSize: '13px',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          {ASSERTION_OPERATORS.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      )
    },
    {
      key: 'value',
      name: 'Expected Value',
      placeholder: 'Expected value',
      render: ({ row, value, isLastEmptyRow, onChange }) => {
        const isUnary = UNARY_OPERATORS.includes(row.operator);
        if (isUnary) {
          return (
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '4px 0' }}>
              (no value needed)
            </span>
          );
        }
        return (
          <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="cell-input"
            value={value}
            placeholder={isLastEmptyRow ? 'Expected value' : ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              padding: '4px 0',
              border: 'none',
              fontSize: '13px'
            }}
          />
        );
      }
    }
  ], []);

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
      <EditableTable
        columns={columns}
        rows={assertionsData}
        onChange={handleAssertionsChange}
        defaultRow={{ expression: '', operator: 'eq', value: '', enabled: true }}
        showCheckbox={true}
        showDelete={true}
        checkboxKey="enabled"
      />
      <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        Use expressions like <code>res.status</code>, <code>res.body.id</code>, or <code>res.headers['content-type']</code>
      </div>
    </div>
  );
};

export default AssertsTab;
