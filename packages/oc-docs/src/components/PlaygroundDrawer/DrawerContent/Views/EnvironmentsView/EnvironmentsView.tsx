import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable } from '@opencollection/types/common/variables';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';
import { SidebarContainer, SidebarItems, SidebarItem } from '../../../Sidebar/StyledWrapper';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateCollectionEnvironments } from '@slices/playground';

interface VariableRow extends EditableTableRow {
  name: string;
  value: string;
  enabled: boolean;
}

const generateUid = () => `envvar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface EnvironmentsViewProps {
  collection: OpenCollection | null;
}

const EnvironmentsView: React.FC<EnvironmentsViewProps> = ({ collection }) => {
  const dispatch = useAppDispatch();
  const [selectedEnvironmentIndex, setSelectedEnvironmentIndex] = useState<number | null>(null);

  const environments = useMemo(() => {
    const envs = (collection as any).environments || collection?.config?.environments || [];
    return [...envs];
  }, [collection]);

  const selectedEnvironment = useMemo(() => {
    if (selectedEnvironmentIndex === null || !environments[selectedEnvironmentIndex]) return null;
    return { ...environments[selectedEnvironmentIndex] };
  }, [environments, selectedEnvironmentIndex]);

  const variableToRow = useCallback((variable: Variable): VariableRow => {
    let value = '';
    if (variable.value) {
      if (typeof variable.value === 'string') {
        value = variable.value;
      } else if (typeof variable.value === 'object' && 'type' in variable.value) {
        value = variable.value.data || '';
      } else if (Array.isArray(variable.value)) {
        const selected = variable.value.find(v => v.selected) || variable.value[0];
        if (selected) {
          if (typeof selected.value === 'string') {
            value = selected.value;
          } else if (typeof selected.value === 'object' && 'type' in selected.value) {
            value = selected.value.data || '';
          }
        }
      }
    }

    return {
      uid: (variable as any).uid || generateUid(),
      name: variable.name || '',
      value,
      enabled: !variable.disabled
    };
  }, []);

  const rowToVariable = useCallback((row: VariableRow): Variable => {
    return {
      uid: row.uid,
      name: row.name,
      value: row.value,
      disabled: !row.enabled
    } as Variable;
  }, []);

  const variablesAsRows = useMemo(() => {
    if (!selectedEnvironment?.variables) return [];
    return selectedEnvironment.variables.map((variable: Variable) => variableToRow(variable));
  }, [selectedEnvironment, variableToRow]);

  const handleVariablesChange = useCallback((rows: VariableRow[]) => {
    if (!selectedEnvironment || !collection || selectedEnvironmentIndex === null) return;

    const updatedVariables: Variable[] = rows.map(rowToVariable);

    const updatedEnvironments = environments.map((env, index) => {
      if (index === selectedEnvironmentIndex) {
        return {
          ...env,
          variables: updatedVariables
        };
      }
      return env;
    });

    const updatedCollection: OpenCollection = {
      ...collection,
      config: collection.config ? {
        ...collection.config,
        environments: updatedEnvironments
      } : {
        environments: updatedEnvironments
      }
    };

    if ((collection as any).environments) {
      (updatedCollection as any).environments = updatedEnvironments;
    }

    dispatch(updateCollectionEnvironments(updatedCollection));
  }, [selectedEnvironment, selectedEnvironmentIndex, collection, environments, rowToVariable, dispatch]);

  const columns: EditableTableColumn<VariableRow>[] = useMemo(() => [
    {
      key: 'name',
      name: 'Variable Name',
      isKeyField: true,
      placeholder: 'Variable Name',
      width: '35%'
    },
    {
      key: 'value',
      name: 'Variable Value',
      placeholder: 'Variable Value'
    }
  ], []);

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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6c757d',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p>No environments found in this collection</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <SidebarContainer className="h-full flex flex-col" style={{ width: 'var(--sidebar-width)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
              Environments
            </h2>
          </div>

          <SidebarItems>
            {environments.map((env: Environment, index: number) => (
              <SidebarItem
                key={index}
                className={`
                  flex items-center select-none text-sm cursor-pointer
                  ${selectedEnvironmentIndex === index ? 'active' : ''}
                  transition-all duration-200
                `}
                style={{ paddingLeft: '12px' }}
                onClick={() => setSelectedEnvironmentIndex(index)}
              >
                {env.color && (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: env.color,
                      marginRight: '8px',
                      flexShrink: 0
                    }}
                  />
                )}
                <div className="truncate flex-1">
                  {env.name || `Environment ${index + 1}`}
                </div>
              </SidebarItem>
            ))}
          </SidebarItems>
        </SidebarContainer>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        minHeight: 0,
        padding: '24px'
      }}>
        {selectedEnvironment ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {selectedEnvironment.name || `Environment ${(selectedEnvironmentIndex || 0) + 1}`}
              </h2>
              {selectedEnvironment.description && (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {typeof selectedEnvironment.description === 'string'
                    ? selectedEnvironment.description
                    : selectedEnvironment.description.content}
                </p>
              )}
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              <EditableTable
                columns={columns}
                rows={variablesAsRows}
                onChange={handleVariablesChange}
                defaultRow={{ name: '', value: '', enabled: true }}
                showCheckbox={true}
                showDelete={false}
                showAddRow={false}
                checkboxKey="enabled"
              />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6c757d'
          }}>
            <p>Select an environment to view its variables</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentsView;
