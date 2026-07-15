import React, { useState, useEffect } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable, VariableValueType } from '@opencollection/types/common/variables';
import KeyValueTable, { KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { EmptyState } from '../../../../../ui/EmptyState/EmptyState';
import { StyledWrapper } from './StyledWrapper';
import { EnvironmentLabel } from '../../../../EnvironmentLabel/EnvironmentLabel';
import EnvVarCards from './EnvVarCards';
import { GlobeIcon } from '../../../../../assets/icons';
import { useAppDispatch } from '../../../../../store/hooks';
import { humanizeType, writeBackValue } from '../../../../../utils/environments';
import { isSecretVariable, unwrapVariableValue } from '../../../../../utils/variableResolution';
import { getVariableTypeLabel } from '../../../../../utils/request';
import { updateCollectionEnvironments } from '@slices/playground';

const ENV_TABS = [
  { id: 'variables', label: 'Variables' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'external', label: 'External' }
] as const;

type EnvTabId = (typeof ENV_TABS)[number]['id'];

interface ExternalSecretRow {
  name?: string;
  secretName?: string;
  enabled?: boolean;
  type?: VariableValueType;
}

export const variableToRow = (variable: Variable, index: number): KeyValueRow => {
  return {
    id: `var-${index}`,
    name: variable.name || '',
    value: unwrapVariableValue(variable.value),
    dataType: getVariableTypeLabel(variable) || '',
    enabled: !variable.disabled,
    secret: isSecretVariable(variable),
    source: variable
  };
};

export const rowToVariable = (row: KeyValueRow): Variable => {
  const source = (row.source as Variable | undefined) ?? ({} as Variable);
  if (row.secret) {
    const secret = { ...source, name: row.name, disabled: !row.enabled, secret: true } as Variable & { value?: unknown };
    if (row.value) secret.value = row.value;
    else delete secret.value;
    return secret;
  }
  return { ...source, name: row.name, value: writeBackValue(source.value, row.value), disabled: !row.enabled };
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
  const plainRows = allVariables.filter((v) => !isSecretVariable(v)).map(variableToRow);
  const secretRows = allVariables.filter((v) => isSecretVariable(v)).map(variableToRow);

  const externalRows: KeyValueRow[] = (selectedEnvironment?.externalSecrets?.variables ?? []).map(
    (variable: ExternalSecretRow, index: number) => ({
      id: `ext-${index}`,
      name: variable.name ?? '',
      value: variable.secretName ?? '',
      enabled: variable.enabled !== false,
      dataType: variable.type ? humanizeType(variable.type) : '',
      varType: variable.type
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
    applyToSelectedEnv({ variables: [...plain, ...secrets].map(rowToVariable) });

  const commitExternal = (rows: KeyValueRow[]) =>
    applyToSelectedEnv({
      externalSecrets: {
        ...(selectedEnvironment?.externalSecrets ?? {}),
        variables: rows.map((row) => ({
          name: row.name,
          secretName: row.value,
          enabled: row.enabled,
          ...(row.varType ? { type: row.varType } : {})
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

  const renderVars = (rows: KeyValueRow[], onChange: (rows: KeyValueRow[]) => void): React.ReactNode =>
    compact ? (
      <EnvVarCards rows={rows} onChange={onChange} />
    ) : (
      <KeyValueTable
        data={rows}
        onChange={onChange}
        keyPlaceholder="Name"
        valuePlaceholder="Value"
        showEnabled={true}
        disableNewRow={true}
        disableDelete={false}
        additionalColumns={[{ key: 'dataType', label: 'Data Type', render: (row) => <span className="text-readonly">{row.dataType || ''}</span> }]}
      />
    );

  const panels: Record<EnvTabId, { contentIndicator: number; content: React.ReactNode }> = {
    variables: {
      contentIndicator: plainRows.length,
      content: (
        <TabPanel isEmpty={!plainRows.length} heading="No variables" subheading="This environment has no variables yet.">
          {renderVars(plainRows, (rows) => commit(rows, secretRows))}
        </TabPanel>
      )
    },
    secrets: {
      contentIndicator: secretRows.length,
      content: (
        <TabPanel isEmpty={!secretRows.length} heading="No secrets" subheading="This environment has no secret variables yet.">
          {renderVars(secretRows, (rows) => commit(plainRows, rows))}
        </TabPanel>
      )
    },
    external: {
      contentIndicator: externalRows.length,
      content: (
        <TabPanel isEmpty={!externalRows.length} heading="No external secrets" subheading="This environment has no external secrets configured.">
          {renderVars(externalRows, commitExternal)}
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
            className={`env-pill${selectedEnvironmentIndex === index ? ' active' : ''}`}
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
