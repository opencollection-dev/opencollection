import type { Variable, VariableValueOrVariants, VariableValueType } from '@opencollection/types/common/variables';
import { unwrapVariableTyped } from './variableResolution';

/** The data types offered in the pre-request variable value dropdown (Bruno's BRUNO_VARIABLE_DATATYPES). */
export type VariableDataType = 'string' | 'number' | 'boolean' | 'object';

export const VARIABLE_DATA_TYPES: VariableDataType[] = ['string', 'number', 'boolean', 'object'];

/**
 * Coerce a string value to its declared data type, matching Bruno's
 * `parseValueByDataType`. Returns the raw value unchanged on any failure so an
 * un-coercible value never throws and never blocks a request.
 */
export const parseValueByDataType = (value: unknown, dataType?: VariableValueType | string): unknown => {
  if (!dataType || dataType === 'string') return value;
  try {
    if (dataType === 'number') {
      if (typeof value === 'number') return value;
      const trimmed = typeof value === 'string' ? value.trim() : value;
      if (trimmed === '' || trimmed == null) return value;
      const num = Number(trimmed);
      if (!Number.isNaN(num)) return num;
    } else if (dataType === 'boolean') {
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
    } else if (dataType === 'object') {
      if (typeof value === 'object' && value !== null) return value;
      const trimmed = typeof value === 'string' ? value.trim() : value;
      if (trimmed === '' || trimmed == null) return value;
      const parsed = JSON.parse(trimmed as string);
      if (parsed !== null && typeof parsed === 'object') return parsed;
    }
  } catch {
    return value;
  }
  return value;
};

/**
 * Advisory validation matching Bruno's `validateDataTypeValue`: returns an error
 * string when the coerced value's runtime type doesn't match the declared type.
 * UI-only — never blocks sending.
 */
export const validateDataTypeValue = (value: unknown, dataType?: VariableValueType | string): string | null => {
  if (!dataType || dataType === 'string') return null;
  if (value === undefined || value === null) return null;
  if (dataType === 'number' && typeof value !== 'number') return `Value is not a valid ${dataType}`;
  if (dataType === 'boolean' && typeof value !== 'boolean') return `Value is not a valid ${dataType}`;
  if (dataType === 'object' && typeof value !== 'object') return `Value is not a valid ${dataType}`;
  return null;
};

export interface VariableRowInput {
  name: string;
  value: string;
  enabled: boolean;
  dataType?: string;
  description?: unknown;
  originalValue?: VariableValueOrVariants;
}

/**
 * Build a schema `Variable` from an editor row: a non-string type produces a
 * `{ type, data }` typed value; `string` stays a plain string. When the display
 * string and type are unchanged the original value is kept verbatim, so a value
 * carrying variants (or an existing typed shape) is never flattened by editing
 * a different field.
 */
export const rowToVariable = (row: VariableRowInput): Variable => {
  const dataType = row.dataType && row.dataType !== 'string' ? (row.dataType as VariableValueType) : undefined;
  const description = row.description !== undefined ? { description: row.description as Variable['description'] } : {};

  const nextValue = dataType ? { type: dataType, data: row.value } : row.value;

  if (row.originalValue !== undefined) {
    const original = unwrapVariableTyped(row.originalValue);
    const originalType =
      original.dataType && original.dataType !== 'string' && (VARIABLE_DATA_TYPES as string[]).includes(original.dataType)
        ? original.dataType
        : undefined;
    if (original.value === row.value && originalType === dataType) {
      return { name: row.name, value: row.originalValue, disabled: !row.enabled, ...description };
    }
    // The value or type changed. If the original carried variants, rewrite only the selected
    // variant and keep the rest, so the non-selected variants aren't flattened away.
    if (Array.isArray(row.originalValue)) {
      const active = row.originalValue.find((variant) => variant.selected) ?? row.originalValue[0];
      const variants = row.originalValue.map((variant) =>
        variant === active ? { ...variant, value: nextValue } : variant
      );
      return { name: row.name, value: variants, disabled: !row.enabled, ...description };
    }
  }

  return { name: row.name, value: nextValue, disabled: !row.enabled, ...description };
};
