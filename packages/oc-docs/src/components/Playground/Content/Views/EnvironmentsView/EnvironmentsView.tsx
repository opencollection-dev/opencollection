import React, { useState, useEffect } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable } from '@opencollection/types/common/variables';
import KeyValueTable, { KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { EmptyState } from '../../../../../ui/EmptyState/EmptyState';
import { StyledWrapper } from './StyledWrapper';
import { EnvironmentLabel } from '../../../../EnvironmentLabel/EnvironmentLabel';
import EnvVarCards from './EnvVarCards/EnvVarCards';
import { variableTypeColumn } from '../Common/VariableTypeControl/variableTypeColumn';
import { GlobeIcon } from '../../../../../assets/icons';
import { useAppDispatch } from '../../../../../store/hooks';
import { cx } from '../../../../../utils/cx';
import { envVariableToRow, envRowToVariable } from '../../../../../utils/environments';
import { isSecretVariable } from '../../../../../utils/variableResolution';
import { updateCollectionEnvironments } from '@slices/playground';

const ENV_TABS = [
  { id: 'variables', label: 'Variables' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'external', label: 'External' }
] as const;

type EnvTabId = (typeof ENV_TABS)[number]['id'];

// Local mirror: @opencollection/types@0.9.2 dist doesn't export SecretProviderType (importing it fails tsc).
type SecretProviderType = 'hashicorp-vault-cloud' | 'hashicorp-vault-server' | 'aws-secrets-manager' | 'azure-key-vault';

const SECRET_POINTER_FIELD: Record<SecretProviderType, 'path' | 'secretName' | 'vaultName'> = {
  'hashicorp-vault-cloud': 'path',
  'hashicorp-vault-server': 'path',
  'aws-secrets-manager': 'secretName',
  'azure-key-vault': 'vaultName'
};

interface TabPanelProps {
  isEmpty: boolean;
  heading: string;
  subheading: string;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ isEmpty, heading, subheading, children }) =>
  isEmpty ? <EmptyState icon={<GlobeIcon />} heading={heading} subheading={subheading} /> : <>{children}</>;

interface EnvironmentsViewProps {
  collection: OpenCollection | null;
  compact?: boolean;
}

const EnvironmentsView: React.FC<EnvironmentsViewProps> = ({ collection, compact = false }) => {
  const dispatch = useAppDispatch();
  const [selectedEnvironmentIndex, setSelectedEnvironmentIndex] = useState<number | null>(null);

  const environments = (collection as any)?.environments || collection?.config?.environments || [];
  const selectedEnvironment =
    selectedEnvironmentIndex !== null ? environments[selectedEnvironmentIndex] ?? null : null;

  const allVariables: Variable[] = selectedEnvironment?.variables ?? [];
  const plainRows = allVariables.filter((v) => !isSecretVariable(v)).map(envVariableToRow);
  const secretRows = allVariables.filter((v) => isSecretVariable(v)).map(envVariableToRow);

  const secretProviderType = selectedEnvironment?.externalSecrets?.type as SecretProviderType | undefined;
  const secretPointerField = (secretProviderType && SECRET_POINTER_FIELD[secretProviderType]) || 'secretName';

  const externalRows: KeyValueRow[] = (selectedEnvironment?.externalSecrets?.variables ?? []).map(
    (variable: { name?: string; disabled?: boolean }, index: number) => ({
      id: `ext-${index}`,
      name: variable.name ?? '',
      value: (variable as Record<string, string | undefined>)[secretPointerField] ?? '',
      enabled: variable.disabled !== true
    })
  );

  const applyToSelectedEnv = (patch: Record<string, unknown>) => {
    if (!collection || selectedEnvironmentIndex === null) return;

    const updatedEnvironments = environments.map((env: Environment, index: number) =>
      index === selectedEnvironmentIndex ? { ...env, ...patch } : env
    );
    const updatedCollection: OpenCollection = {
      ...collection,
      config: collection.config
        ? { ...collection.config, environments: updatedEnvironments }
        : { environments: updatedEnvironments }
    };
    if ((collection as any).environments) {
      (updatedCollection as any).environments = updatedEnvironments;
    }

    dispatch(updateCollectionEnvironments(updatedCollection));
  };

  const commit = (plain: KeyValueRow[], secrets: KeyValueRow[]) =>
    applyToSelectedEnv({ variables: [...plain, ...secrets].map(envRowToVariable) });

  const commitExternal = (rows: KeyValueRow[]) =>
    applyToSelectedEnv({
      externalSecrets: {
        ...(selectedEnvironment?.externalSecrets ?? {}),
        variables: rows.map((row) => ({
          name: row.name,
          [secretPointerField]: row.value,
          disabled: !row.enabled
        }))
      }
    });

  useEffect(() => {
    if (selectedEnvironmentIndex === null && environments.length > 0) {
      setSelectedEnvironmentIndex(0);
    }
  }, [environments.length, selectedEnvironmentIndex]);

  useEffect(() => {
    if (selectedEnvironmentIndex !== null && selectedEnvironmentIndex >= environments.length) {
      setSelectedEnvironmentIndex(environments.length > 0 ? 0 : null);
    }
  }, [environments.length, selectedEnvironmentIndex]);

  if (environments.length === 0) {
    return (
      <StyledWrapper>
        <div className="env-message">
          <p>No environments found in this collection</p>
        </div>
      </StyledWrapper>
    );
  }

  interface RenderVarsOptions {
    makeNewRow?: () => Partial<KeyValueRow>;
    disableNewRow?: boolean;
    editableDataType?: boolean;
  }

  const renderVars = (
    rows: KeyValueRow[],
    onChange: (rows: KeyValueRow[]) => void,
    { makeNewRow, disableNewRow = false, editableDataType = false }: RenderVarsOptions = {}
  ): React.ReactNode =>
    compact ? (
      <EnvVarCards
        rows={rows}
        onChange={onChange}
        makeNewRow={makeNewRow}
        disableNewRow={disableNewRow}
        editableDataType={editableDataType}
        secretEditByDefault
        addWhenComplete
        testId="env-var-cards"
      />
    ) : (
      <KeyValueTable
        data={rows}
        onChange={onChange}
        keyPlaceholder="Name"
        valuePlaceholder="Value"
        showEnabled={true}
        multilineValues
        inlineActions={editableDataType}
        disableNewRow={disableNewRow}
        makeNewRow={makeNewRow}
        addWhenComplete
        disableDelete={false}
        secretEditByDefault
        additionalColumns={editableDataType ? [variableTypeColumn] : []}
      />
    );

  const panels: Record<EnvTabId, { contentIndicator: number; content: React.ReactNode }> = {
    variables: {
      contentIndicator: plainRows.length,
      content: renderVars(plainRows, (rows) => commit(rows, secretRows), { editableDataType: true })
    },
    secrets: {
      contentIndicator: secretRows.length,
      content: renderVars(secretRows, (rows) => commit(plainRows, rows), { makeNewRow: () => ({ secret: true }), editableDataType: true })
    },
    external: {
      contentIndicator: externalRows.length,
      content: (
        <TabPanel isEmpty={!externalRows.length} heading="No external secrets" subheading="This environment has no external secrets configured.">
          {renderVars(externalRows, commitExternal, { disableNewRow: true })}
        </TabPanel>
      )
    }
  };

  const tabs = ENV_TABS.map(({ id, label }) => ({
    id,
    label,
    contentIndicator: panels[id].contentIndicator,
    content: panels[id].content
  }));

  return (
    <StyledWrapper>
      <div className="env-header">
        <h2 className="env-title">Environments</h2>
      </div>

      <div className="env-pills">
        {environments.map((env: Environment, index: number) => (
          <button
            key={index}
            type="button"
            className={cx('env-pill', { active: selectedEnvironmentIndex === index })}
            data-testid={`env-pill-${env.name || index}`}
            onClick={() => setSelectedEnvironmentIndex(index)}
          >
            <EnvironmentLabel name={env.name || `Environment ${index + 1}`} color={env.color} />
          </button>
        ))}
      </div>

      <div className="env-tabs-area">
        {selectedEnvironment ? (
          <Tabs defaultActiveTab="variables" tabs={tabs} />
        ) : (
          <div className="env-message">
            <p>Select an environment to view its variables</p>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default EnvironmentsView;
