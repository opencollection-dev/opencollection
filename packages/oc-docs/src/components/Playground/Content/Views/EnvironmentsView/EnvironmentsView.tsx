import React, { useState, useEffect } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable } from '@opencollection/types/common/variables';
import KeyValueTable, { KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { EmptyState } from '../../../../../ui/EmptyState/EmptyState';
import { EnvView, EnvMessage, EnvPills, EnvPill, EnvTabsArea } from './StyledWrapper';
import { EnvironmentLabel } from '../../../../EnvironmentLabel/EnvironmentLabel';
import EnvVarCards from './EnvVarCards';
import { GlobeIcon } from '../../../../../assets/icons';
import { useAppDispatch } from '../../../../../store/hooks';
import { isSecretVariable, resolveValue, humanizeType } from '../../../../../utils/environments';
import { updateCollectionEnvironments } from '@slices/playground';

const ENV_TABS = [
  { id: 'variables', label: 'Variables' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'external', label: 'External' }
] as const;

const variableToRow = (variable: Variable, index: number): KeyValueRow => {
  const resolved = resolveValue(variable.value);
  return {
    id: `var-${index}`,
    name: variable.name || '',
    value: resolved.value,
    dataType: resolved.value ? humanizeType(resolved.type) : '',
    enabled: !variable.disabled,
    secret: isSecretVariable(variable)
  };
};

const rowToVariable = (row: KeyValueRow): Variable =>
  ({
    name: row.name,
    value: row.value,
    disabled: !row.enabled,
    ...(row.secret ? { secret: true } : {})
  } as Variable);

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
    (variable: any, index: number) => ({
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
      <EnvMessage>
        <p>No environments found in this collection</p>
      </EnvMessage>
    );
  }

  const renderVars = (rows: KeyValueRow[], onChange: (rows: KeyValueRow[]) => void): React.ReactNode =>
    compact ? (
      <EnvVarCards rows={rows} onChange={onChange} />
    ) : (
      <KeyValueTable
        data={rows}
        onChange={onChange}
        keyPlaceholder="Variable Name"
        valuePlaceholder="Variable Value"
        showEnabled={true}
        disableNewRow={true}
        disableDelete={false}
        additionalColumns={[{ key: 'dataType', label: 'Data Type', render: (row) => <span className="text-readonly">{row.dataType || ''}</span> }]}
      />
    );

  const panels: Record<string, { contentIndicator: number; content: React.ReactNode }> = {
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
    <EnvView>
      <div className="env-header">
        <h2 className="env-title">Environments</h2>
      </div>

      <EnvPills>
        {environments.map((env: Environment, index: number) => (
          <EnvPill
            key={index}
            className={selectedEnvironmentIndex === index ? 'active' : ''}
            onClick={() => setSelectedEnvironmentIndex(index)}
          >
            <EnvironmentLabel name={env.name || `Environment ${index + 1}`} color={env.color} />
          </EnvPill>
        ))}
      </EnvPills>

      <EnvTabsArea>
        {selectedEnvironment ? (
          <Tabs defaultActiveTab="variables" tabs={tabs} />
        ) : (
          <EnvMessage>
            <p>Select an environment to view its variables</p>
          </EnvMessage>
        )}
      </EnvTabsArea>
    </EnvView>
  );
};

export default EnvironmentsView;
