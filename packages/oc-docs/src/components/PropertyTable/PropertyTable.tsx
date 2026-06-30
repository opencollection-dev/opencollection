import React from 'react';
import { SecretValue } from '../../ui/SecretValue/SecretValue';
import { VariableText } from '../VariableText/VariableText';
import { StyledWrapper } from './StyledWrapper';

export interface PropertyRow {
  label: string;
  value?: string;
  secret?: boolean;
  node?: React.ReactNode;
  disabled?: boolean;
  testId?: string;
}

interface PropertyTableProps {
  rows: PropertyRow[];
  emptyMessage?: string;
  className?: string;
  testId?: string;
}

const ValueCell: React.FC<{ row: PropertyRow; testId?: string }> = ({ row, testId }) => {
  if (row.node !== undefined) return <>{row.node}</>;
  if (row.secret) return <SecretValue value={row.value ?? ''} testId={testId ? `${testId}-secret` : undefined} />;
  return <VariableText value={row.value ?? ''} />;
};

export const PropertyTable: React.FC<PropertyTableProps> = ({ rows, emptyMessage, className, testId }) => (
  <StyledWrapper className={['property-table', className].filter(Boolean).join(' ')} data-testid={testId}>
    {rows.length === 0 ? (
      emptyMessage ? (
        <p className="property-empty-message" data-testid={testId ? `${testId}-empty` : undefined}>{emptyMessage}</p>
      ) : null
    ) : (
      <dl className="property-box">
        {rows.map((row, index) => (
          <div
            className={['property-row', row.disabled ? 'property-row--disabled' : ''].filter(Boolean).join(' ')}
            key={`${row.label}-${index}`}
          >
            <dt className="property-key">{row.label}</dt>
            <dd className="property-value-cell" data-testid={testId && row.testId ? `${testId}-${row.testId}` : undefined}>
              <ValueCell row={row} testId={testId} />
            </dd>
          </div>
        ))}
      </dl>
    )}
  </StyledWrapper>
);

export default PropertyTable;
