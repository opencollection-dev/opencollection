import React from 'react';
import Dropdown from '../../ui/Dropdown/Dropdown';
import { GlobeIcon } from '../../assets/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveEnvironmentName, selectDocsCollection, setActiveEnvironment } from '../../store/slices/docs';

interface EnvironmentSwitcherProps {
  testId?: string;
}

export const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({ testId = 'environment-switcher' }) => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const activeName = useAppSelector(selectActiveEnvironmentName);
  const environments = collection?.config?.environments ?? [];

  if (environments.length === 0) return null;

  const effectiveName = activeName ?? environments[0].name;

  return (
    <Dropdown label={effectiveName || 'Environment'} active menuLabel="Select environment" testId={testId}>
      {({ close }) =>
        environments.map((environment) => (
          <li key={environment.name} role="option" aria-selected={environment.name === effectiveName}>
            <button
              type="button"
              className={`dropdown-option${environment.name === effectiveName ? ' is-selected' : ''}`}
              data-testid="environment-switcher-option"
              onClick={() => {
                dispatch(setActiveEnvironment(environment.name));
                close();
              }}
            >
              <GlobeIcon />
              <span className="dropdown-label">{environment.name}</span>
            </button>
          </li>
        ))
      }
    </Dropdown>
  );
};

export default EnvironmentSwitcher;
