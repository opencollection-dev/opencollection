import React from 'react';
import { KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { SecretValue } from '../../../../../ui/SecretValue/SecretValue';
import { TrashIcon } from '../../../../../assets/icons';

interface EnvVarCardsProps {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
}

const EnvVarCards: React.FC<EnvVarCardsProps> = ({ rows, onChange }) => {
  const update = (index: number, patch: Partial<KeyValueRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const remove = (index: number) => onChange(rows.filter((_, i) => i !== index));

  return (
    <div className="env-card-list">
      {rows.map((row, index) => (
        <div key={row.id} className={`env-card${row.enabled ? '' : ' disabled'}`}>
          <input
            type="checkbox"
            className="enabled"
            checked={row.enabled}
            onChange={(e) => update(index, { enabled: e.target.checked })}
          />
          <div className="body">
            <input
              className="name"
              data-testid={`env-var-name-${index}`}
              value={row.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <div className="value">
              {row.secret ? (
                <SecretValue value={row.value} onChange={(v) => update(index, { value: v })} />
              ) : (
                <input
                  className="value-input"
                  data-testid={`env-var-value-${index}`}
                  value={row.value}
                  onChange={(e) => update(index, { value: e.target.value })}
                />
              )}
              {row.dataType ? <span className="datatype">{row.dataType}</span> : null}
            </div>
          </div>
          <button
            type="button"
            className="delete"
            aria-label="Delete variable"
            title="Delete"
            onClick={() => remove(index)}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EnvVarCards;
