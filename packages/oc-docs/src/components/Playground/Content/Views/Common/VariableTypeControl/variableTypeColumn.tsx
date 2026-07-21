import React from 'react';
import type { AdditionalColumn } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { toDataType } from '../../../../../../utils/variableDataType';
import { VariableTypeControl } from './VariableTypeControl';

/** A `KeyValueTable` column that renders the editable type dropdown and writes the choice back to the row. */
export const variableTypeColumn: AdditionalColumn = {
  key: 'datatype',
  label: '',
  render: (row, index, updateField) => (
    <VariableTypeControl
      dataType={toDataType(row.dataType)}
      value={row.value}
      index={index}
      onChange={(type) => updateField('dataType', type)}
    />
  )
};
