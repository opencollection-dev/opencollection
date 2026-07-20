import React, { useEffect, useMemo } from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectActiveEnvName, setActiveEnv } from '../../store/slices/env';
import { ChevronDownIcon } from '../../assets/icons';
import { EnvironmentLabel } from '../EnvironmentLabel/EnvironmentLabel';
import MenuDropdown, { type MenuDropdownItem } from '../../ui/MenuDropdown';
import { StyledWrapper } from './StyledWrapper';

export interface EnvSwitcherProps {
  testId?: string;
}

/**
 * Environment switcher for the docs: lets the reader pick which environment's
 * values are shown, storing the choice in the env slice. Self-contained (no
 * layout assumptions) so it can sit in the topbar or elsewhere. The dot + name
 * reuse `EnvironmentLabel`. The menu renders through `MenuDropdown` (Tippy),
 * which portals to <body>, positions against the trigger, tracks scroll/resize,
 * and handles outside-click and Escape — so this component owns no positioning
 * or dismissal logic of its own. Tippy's `--z-popover` surface keeps the menu
 * above every playground dock.
 */
const EnvSwitcher: React.FC<EnvSwitcherProps> = ({ testId = 'env-switcher' }) => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const activeEnvName = useAppSelector(selectActiveEnvName);

  const environments = useMemo(
    () => (collection?.config?.environments ?? []) as Environment[],
    [collection]
  );
  const hasEnvironments = environments.length > 0;

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

  const items: MenuDropdownItem[] = hasEnvironments
    ? environments.map((environment) => ({
        id: environment.name,
        label: <EnvironmentLabel name={environment.name} color={environment.color} />,
        ariaLabel: environment.name,
        title: environment.name,
        onClick: () => dispatch(setActiveEnv(environment.name))
      }))
    : [{ id: 'no-environments', label: 'No environments', disabled: true }];

  return (
    <StyledWrapper data-testid={`${testId}-root`}>
      <MenuDropdown
        items={items}
        selectedItemId={hasEnvironments ? activeEnv?.name : undefined}
        showTickMark={false}
        placement="bottom-end"
        testId={testId}
      >
        <button
          type="button"
          className={`env-switcher-trigger${hasEnvironments ? '' : ' env-switcher-trigger--empty'}`}
          aria-haspopup="menu"
          aria-label="Select environment"
          title={hasEnvironments ? activeEnv?.name : undefined}
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
      </MenuDropdown>
    </StyledWrapper>
  );
};

export default EnvSwitcher;
