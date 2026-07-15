import type { AdditionalColumn } from '../components/KeyValueTable/KeyValueTable';

/** Read-only "Data Type" column shared by the variable-bearing playground tables. */
export const dataTypeColumn: AdditionalColumn = {
  key: 'type',
  label: 'Data Type',
  render: (row) => row.dataType || null
};
