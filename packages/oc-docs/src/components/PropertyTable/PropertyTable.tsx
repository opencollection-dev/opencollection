import React from 'react';
import { SecretValue } from '../../ui/SecretValue/SecretValue';
import { VariableText } from '../VariableText/VariableText';
import { TruncatedText } from '../TruncatedText/TruncatedText';
import { Description } from '../Description/Description';
import { DisabledBadge } from '../DisabledBadge/DisabledBadge';
import { StyledWrapper } from './StyledWrapper';

export interface PropertyRow {
  label: string;
  value?: string;
  type?: string;
  secret?: boolean;
  node?: React.ReactNode;
  disabled?: boolean;
  description?: string;
  testId?: string;
}

interface PropertyTableProps {
  rows: PropertyRow[];
  emptyMessage?: string;
  className?: string;
  testId?: string;
  hideRowBorders?: boolean;
}

const ValueCell: React.FC<{ row: PropertyRow; testId?: string }> = ({ row, testId }) => {
  if (row.node !== undefined) return <>{row.node}</>;
  if (row.secret)
    return <SecretValue value={<VariableText value={row.value ?? ''} />} testId={testId && `${testId}-secret`} />;
  return (
    <TruncatedText text={row.value ?? ''}>
      <VariableText value={row.value ?? ''} />
    </TruncatedText>
  );
};

export const PropertyTable: React.FC<PropertyTableProps> = ({ rows, emptyMessage, className, testId = 'property-table', hideRowBorders = false }) => (
  <StyledWrapper
    className={['property-table', hideRowBorders ? 'property-table--no-row-borders' : '', className].filter(Boolean).join(' ')}
    data-testid={testId}
  >
    {rows.length === 0 ? (
      emptyMessage ? (
        <p className="property-empty-message" data-testid={testId ? `${testId}-empty` : undefined}>{emptyMessage}</p>
      ) : null
    ) : (
      <dl className="property-box">
        {rows.map((row, index) => (
          <div className="property-row" key={`${row.label}-${index}`}>
            <dt className="property-key"><TruncatedText text={row.label} /></dt>
            <dd className="property-value-cell" data-testid={testId && row.testId ? `${testId}-${row.testId}` : undefined}>
              <div className="property-value-line">
                <div className="property-value-main" data-testid="property-value"><ValueCell row={row} testId={testId} /></div>
                {row.type ? <span className="property-type">{row.type}</span> : null}
                {row.disabled ? <DisabledBadge /> : null}
              </div>
            </dd>
            <Description text={row.description} />
          </div>
        ))}
      </dl>
    )}
  </StyledWrapper>
);

export default PropertyTable;
