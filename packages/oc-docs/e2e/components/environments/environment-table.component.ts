import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class EnvironmentTableComponent extends BaseComponent {
  readonly root = this.page.getByTestId('environment-table');
  readonly variableRows = this.page.getByTestId('environment-variable-row');
  readonly secretVariableRows = this.page.getByTestId('environment-secret-variable-row');
  readonly externalSecretRows = this.page.getByTestId('environment-external-secret-row');

  columnHeader(key: string): Locator {
    return this.root.getByTestId(`table-header-${key}`);
  }

  variableRow(name: string): Locator {
    return this.variableRows.filter({ hasText: name });
  }

  secretVariableRow(name: string): Locator {
    return this.secretVariableRows.filter({ hasText: name });
  }

  externalSecretRow(name: string): Locator {
    return this.externalSecretRows.filter({ hasText: name });
  }

  valueOf(name: string): Locator {
    return this.variableRow(name).getByTestId('table-cell-value');
  }

  dataTypeOf(name: string): Locator {
    return this.variableRow(name).getByTestId('table-cell-type');
  }
}
