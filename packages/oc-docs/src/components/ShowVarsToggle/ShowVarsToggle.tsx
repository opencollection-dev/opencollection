import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectShowVars, toggleShowVars } from '@slices/env';
import { StyledWrapper } from './StyledWrapper';

export interface ShowVarsToggleProps {
  testId?: string;
}

/**
 * Placement-agnostic show-variables toggle. Bound to the single global
 * `showVars` flag in the env slice, so it flips the same state from any
 * container alongside the environment switcher.
 */
const ShowVarsToggle: React.FC<ShowVarsToggleProps> = ({ testId = 'show-vars-toggle' }) => {
  const dispatch = useAppDispatch();
  const showVars = useAppSelector(selectShowVars);

  return (
    <StyledWrapper
      type="button"
      role="switch"
      data-testid={testId}
      aria-checked={showVars}
      aria-label="Show variables"
      onClick={() => dispatch(toggleShowVars())}
    >
      <span className="show-vars-track" aria-hidden="true">
        <span className="show-vars-thumb" />
      </span>
      <span className="show-vars-label">Show vars</span>
    </StyledWrapper>
  );
};

export default ShowVarsToggle;
