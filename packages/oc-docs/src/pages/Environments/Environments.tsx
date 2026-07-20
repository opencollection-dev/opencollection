import React, { useMemo, useRef, useState } from 'react';
import type { OpenCollection } from '@opencollection/types';
import { getEnvironmentVariables } from '../../utils/environments';
import { getDescription } from '../../utils/request';
import { useMarkdownRenderer } from '../../hooks';
import { Table, type TableColumn, type TableGroup } from '../../ui/Table/Table';
import { EnvironmentLabel } from '../../components/EnvironmentLabel/EnvironmentLabel';
import { VariableText } from '../../components/VariableText/VariableText';
import { TruncatedText } from '../../components/TruncatedText/TruncatedText';
import { Description } from '../../components/Description/Description';
import { DisabledBadge } from '../../components/DisabledBadge/DisabledBadge';
import { ViewMore } from '../../components/ViewMore/ViewMore';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { GlobeIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

const COLUMNS: TableColumn[] = [
  { key: 'name', header: 'Name', width: '13rem' },
  { key: 'value', header: 'Value' },
  { key: 'type', header: 'Data Type', width: '9rem' }
];

const emptyCell = <span className="environment-empty">(empty)</span>;

const nameCell = (name: string, disabled?: boolean): React.ReactNode => {
  const label = <TruncatedText className="environment-name" text={name} />;
  return disabled ? (
    <span className="environment-name-cell">
      {label}
      <DisabledBadge />
    </span>
  ) : (
    label
  );
};

const valueCell = (value: string): React.ReactNode =>
  value ? (
    <TruncatedText className="environment-value" text={value}>
      <VariableText value={value} />
    </TruncatedText>
  ) : (
    emptyCell
  );

const secretCell = (): React.ReactNode => (
  <span className="environment-empty" data-testid="environment-secret-value">
    (Secret)
  </span>
);

const typeCell = (dataType: string): React.ReactNode =>
  dataType ? <TruncatedText className="environment-type" text={dataType} /> : emptyCell;

interface EnvironmentsProps {
  collection: OpenCollection;
}

export const Environments: React.FC<EnvironmentsProps> = ({ collection }) => {
  const environments = collection.config?.environments ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistId = 'environments-tab';
  const panelId = 'environments-panel';

  const activeTab = environments.length ? Math.min(activeIndex, environments.length - 1) : 0;
  const active = environments[activeTab];
  const md = useMarkdownRenderer();
  const descriptionHtml = useMemo(() => {
    const content = getDescription(active);
    return content ? md.render(content) : '';
  }, [active, md]);

  const groups = useMemo<TableGroup[]>(() => {
    if (!active) return [];
    const { variables, secretVariables, externalSecrets } = getEnvironmentVariables(active);
    const result: TableGroup[] = [];

    if (variables.length) {
      result.push({
        id: 'variables',
        label: 'Variables',
        badge: variables.length,
        testId: 'environment-variables',
        rows: variables.map((row) => ({
          id: `var-${row.name}`,
          rowHeaderKey: 'name',
          testId: 'environment-variable-row',
          cells: {
            name: nameCell(row.name, row.disabled),
            value: valueCell(row.value),
            type: typeCell(row.dataType)
          },
          description: row.description?.trim() ? <Description text={row.description} /> : undefined
        }))
      });
    }

    if (secretVariables.length) {
      result.push({
        id: 'secret-variables',
        label: 'Secret Variables',
        badge: secretVariables.length,
        testId: 'environment-secret-variables',
        rows: secretVariables.map((row) => ({
          id: `secret-${row.name}`,
          rowHeaderKey: 'name',
          testId: 'environment-secret-variable-row',
          cells: {
            name: nameCell(row.name, row.disabled),
            value: secretCell(),
            type: typeCell(row.dataType)
          },
          description: row.description?.trim() ? <Description text={row.description} /> : undefined
        }))
      });
    }

    if (externalSecrets) {
      result.push({
        id: 'external-secrets',
        label: 'External Secret Variables',
        badge: externalSecrets.variables.length,
        meta: externalSecrets.typeLabel,
        testId: 'environment-external-secrets',
        rows: externalSecrets.variables.map((row) => ({
          id: `ext-${row.name}`,
          rowHeaderKey: 'name',
          testId: 'environment-external-secret-row',
          cells: {
            name: nameCell(row.name, row.disabled),
            value: valueCell(row.secretName),
            type: typeCell(row.dataType)
          }
        }))
      });
    }

    return result;
  }, [active]);

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = (activeTab + delta + environments.length) % environments.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <PageWrapper>
      <StyledWrapper className="environments" data-testid="environments-page">
        <Heading size='md' testId="environments-title">Environments</Heading>

        {environments.length ? (
          <>
            <div role="tablist" aria-label="Environments" className="environment-tabs">
              {environments.map((environment, index) => {
                const selected = index === activeTab;
                return (
                  <button
                    key={`${environment.name}-${index}`}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`${tablistId}-${index}`}
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    className={['environment-tab', selected ? 'is-active' : ''].filter(Boolean).join(' ')}
                    data-testid="environment-tab"
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={onTabKeyDown}
                  >
                    <EnvironmentLabel name={environment.name} color={environment.color} />
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={`${tablistId}-${activeTab}`}
              className="environment-panel"
            >
              {descriptionHtml && (
                <ViewMore collapsedHeight="4.5rem" className="environment-description" testId="environment-description">
                  <div className="markdown-documentation" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </ViewMore>
              )}
              <Table
                columns={COLUMNS}
                groups={groups}
                minWidth="34rem"
                emptyMessage="This environment has no variables."
                caption={`Variables for the ${active?.name ?? ''} environment`}
                testId="environment-table"
              />
            </div>
          </>
        ) : (
          <EmptyState
            testId="environments-empty"
            icon={<GlobeIcon />}
            className='environment-empty'
            heading="No environments configured"
            subheading="This collection has no environments yet. Add an environment in Bruno to define base URLs, tokens, and other variables that requests can reference."
          />
        )}
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Environments;
