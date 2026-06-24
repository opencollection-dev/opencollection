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
}

interface PropertyTableProps {
  rows: PropertyRow[];
  emptyMessage?: string;
  className?: string;
}

const ValueCell: React.FC<{ row: PropertyRow }> = ({ row }) => {
  if (row.node !== undefined) return <>{row.node}</>;
  if (row.secret) return <SecretValue value={row.value ?? ''} />;
  return <VariableText value={row.value ?? ''} />;
};

export const PropertyTable: React.FC<PropertyTableProps> = ({ rows, emptyMessage, className }) => (
  <StyledWrapper className={['property-table', className].filter(Boolean).join(' ')}>
    {rows.length === 0 ? (
      emptyMessage ? <p className="property-empty-message">{emptyMessage}</p> : null
    ) : (
      <dl className="property-box">
        {rows.map((row, index) => (
          <div
            className={['property-row', row.disabled ? 'property-row--disabled' : ''].filter(Boolean).join(' ')}
            key={`${row.label}-${index}`}
          >
            <dt className="property-key">{row.label}</dt>
            <dd className="property-value-cell">
              <ValueCell row={row} />
            </dd>
          </div>
        ))}
      </dl>
    )}
  </StyledWrapper>
);

export default PropertyTable;
