import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import { getShortMethod } from '@utils/request';
import { StyledWrapper } from './StyledWrapper';

interface MethodChipsProps {
  /** Canonical methods present in the collection, in display order. */
  methods: string[];
  /** Canonical methods currently active (e.g. {'GET','DELETE'}). */
  active: ReadonlySet<string>;
  /** Toggle a canonical method on/off. */
  onToggle: (method: string) => void;
  testId?: string;
}

/** Method filter toggles for the search palette, one chip per method present in
 * the collection. Local to the palette, never written to the shared search
 * slice. Overflows to a horizontal scroll when the chips exceed the row. */
export const MethodChips: React.FC<MethodChipsProps> = ({
  methods,
  active,
  onToggle,
  testId = 'search-method-chips',
}) => (
  <StyledWrapper data-testid={testId}>
    {methods.map((method) => (
      <button
        key={method}
        type="button"
        className="method-chip"
        aria-pressed={active.has(method)}
        style={{ ['--chip-color' as string]: getMethodColorVar(method) }}
        onClick={() => onToggle(method)}
      >
        {getShortMethod(method)}
      </button>
    ))}
  </StyledWrapper>
);

export default MethodChips;
