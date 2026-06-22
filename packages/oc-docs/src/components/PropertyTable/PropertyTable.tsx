import React from 'react';
import { SecretValue } from '../../ui/SecretValue/SecretValue';
import { VariableText } from '../VariableText';
import { PropertyTableWrapper } from './StyledWrapper';

export interface PropertyRow {
  /** Left-column label (header name, "Mode", param/var name, …). */
  label: string;
  /** Right-column value; rendered with `{{var}}` highlighting unless `node` is set. */
  value?: string;
  /** Render the value masked (reveal-on-click) for secrets. */
  secret?: boolean;
  /** Custom cell content; overrides `value`/`secret`. */
  node?: React.ReactNode;
  /** Visually mark the row as disabled. */
  disabled?: boolean;
}

interface PropertyTableProps {
  rows: PropertyRow[];
  /** Italic placeholder shown when there are no rows. */
  emptyMessage?: string;
  className?: string;
}

const ValueCell: React.FC<{ row: PropertyRow }> = ({ row }) => {
  if (row.node !== undefined) return <>{row.node}</>;
  if (row.secret) return <SecretValue value={row.value ?? ''} />;
  return <VariableText value={row.value ?? ''} />;
};

/**
 * Read-only key/value table for request/collection metadata (headers, params, auth
 * fields, vars). Plain values highlight `{{vars}}`; `secret` values are masked.
 * Shared across the docs — Collection Configuration (Overview) and the request page.
 */
export const PropertyTable: React.FC<PropertyTableProps> = ({ rows, emptyMessage, className }) => (
  <PropertyTableWrapper className={['property-table', className].filter(Boolean).join(' ')}>
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
  </PropertyTableWrapper>
);

export default PropertyTable;
