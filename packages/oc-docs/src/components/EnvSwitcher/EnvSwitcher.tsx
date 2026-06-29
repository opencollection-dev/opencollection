import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectActiveEnvName, setActiveEnv } from '../../store/slices/env';
import { useClickOutside, useEscapeKey } from '../../hooks';
import { ChevronDownIcon } from '../../assets/icons';
import { EnvironmentLabel } from '../EnvironmentLabel/EnvironmentLabel';
import { StyledWrapper } from './StyledWrapper';

export interface EnvSwitcherProps {
  testId?: string;
}

/**
 * Environment switcher for the docs: lets the reader pick which environment's
 * values are shown, storing the choice in the env slice. Self-contained (no
 * layout assumptions) so it can sit in the topbar or elsewhere. The dot + name
 * reuse `EnvironmentLabel`; dismissal reuses the shared `useClickOutside` /
 * `useEscapeKey` hooks.
 */
const EnvSwitcher: React.FC<EnvSwitcherProps> = ({ testId = 'env-switcher' }) => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const activeEnvName = useAppSelector(selectActiveEnvName);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const environments = useMemo(
    () => (collection?.config?.environments ?? []) as Environment[],
    [collection]
  );
  const hasEnvironments = environments.length > 0;

  const close = useCallback(() => setOpen(false), []);
  // Escape returns focus to the trigger for keyboard users; a pointer-driven
  // outside close leaves focus where the pointer went.
  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);
  useClickOutside(containerRef, close, open);
  useEscapeKey(closeAndRefocus, open);

  // The active env, resolving a null or stale (no longer present) selection to
  // the first environment. Single source for both the render and the effect.
  const activeEnv =
    environments.find((environment) => environment.name === activeEnvName) ??
    (hasEnvironments ? environments[0] : undefined);

  // Sync the store when the stored name isn't the resolved one (null or stale),
  // so the persisted selection self-heals to a real environment.
  useEffect(() => {
    if (activeEnv && activeEnv.name !== activeEnvName) {
      dispatch(setActiveEnv(activeEnv.name));
    }
  }, [activeEnv, activeEnvName, dispatch]);

  const select = (name: string) => {
    dispatch(setActiveEnv(name));
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <StyledWrapper ref={containerRef} data-testid={testId}>
      <button
        ref={triggerRef}
        type="button"
        className={`env-switcher-trigger${hasEnvironments ? '' : ' env-switcher-trigger--empty'}`}
        data-testid={`${testId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select environment"
        title={hasEnvironments ? activeEnv?.name : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        <EnvironmentLabel
          name={hasEnvironments ? activeEnv?.name ?? '' : 'No environments'}
          color={activeEnv?.color}
          nameClassName="env-switcher-trigger-name"
        />
        <span className="env-switcher-chevron">
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="env-switcher-popover" role="listbox" aria-label="Environments">
          {hasEnvironments ? (
            environments.map((environment) => {
              const isActive = environment.name === activeEnv?.name;
              return (
                <button
                  key={environment.name}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-testid={`${testId}-option-${environment.name}`}
                  className={`env-switcher-option${isActive ? ' env-switcher-option--active' : ''}`}
                  title={environment.name}
                  onClick={() => select(environment.name)}
                >
                  <EnvironmentLabel
                    name={environment.name}
                    color={environment.color}
                    nameClassName="env-switcher-option-name"
                  />
                </button>
              );
            })
          ) : (
            <div className="env-switcher-empty">No environments</div>
          )}
        </div>
      )}
    </StyledWrapper>
  );
};

export default EnvSwitcher;
