import React from 'react';
import { IconCaretDown } from '@tabler/icons';
import type { Assertion } from '@opencollection/types/common/assertions';
import KeyValueTable, { type KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import MenuDropdown from '../../../../../../ui/MenuDropdown';
import { StyledWrapper } from './StyledWrapper';

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

const DEFAULT_OPERATOR = ASSERTION_OPERATORS[0].value;

// Operators that assert on the expression alone; their value input is cleared.
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
  const assertionsData: KeyValueRow[] = (assertions || []).map((assertion, index) => ({
    id: `assertion-${index}`,
    name: assertion.expression || '',
    value: assertion.value || '',
    operator: assertion.operator || DEFAULT_OPERATOR,
    enabled: !assertion.disabled
  }));

  const handleAssertionsChange = (rows: KeyValueRow[]) => {
    const updatedAssertions: Assertion[] = rows.map((row) => {
      const operator = row.operator || DEFAULT_OPERATOR;
      const isUnary = UNARY_OPERATORS.includes(operator);
      return {
        expression: row.name,
        operator,
        value: isUnary ? undefined : row.value,
        disabled: !row.enabled
      };
    });
    onAssertionsChange(updatedAssertions);
  };

  const handleOperatorChange = (index: number, newOperator: string) => {
    const updatedRows = [...assertionsData];
    updatedRows[index] = { ...updatedRows[index], operator: newOperator };
    if (UNARY_OPERATORS.includes(newOperator)) {
      updatedRows[index].value = '';
    }
    handleAssertionsChange(updatedRows);
  };

  return (
    <StyledWrapper>
      <div className="asserts-header">
        <span className="asserts-title">{title}</span>
        {description && <span className="asserts-description">{description}</span>}
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
              // currentOperator always resolves to a real entry, so its id matches a menu item.
              const currentOperator =
                ASSERTION_OPERATORS.find((op) => op.value === row.operator) ?? ASSERTION_OPERATORS[0];
              return (
                <MenuDropdown
                  selectedItemId={currentOperator.value}
                  placement="bottom-start"
                  data-testid={`assertion-operator-${index}`}
                  items={ASSERTION_OPERATORS.map((op) => ({
                    id: op.value,
                    label: op.label,
                    onClick: () => handleOperatorChange(index, op.value)
                  }))}
                >
                  <button type="button" aria-label="Operator" className="operator-trigger">
                    <span>{currentOperator.label}</span>
                    <IconCaretDown className="operator-caret" size={14} strokeWidth={2} aria-hidden />
                  </button>
                </MenuDropdown>
              );
            }
          }
        ]}
      />
      <div className="asserts-hint">
        Use expressions like <code>res.status</code>, <code>res.body.id</code>, or{' '}
        <code>res.headers['content-type']</code>
      </div>
    </StyledWrapper>
  );
};

export default AssertsTab;
