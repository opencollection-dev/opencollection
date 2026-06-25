import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ExecutionContextComponent extends BaseComponent {
  readonly root = this.page.getByTestId('execution-context');

  readonly scripts = this.root.getByTestId('execution-context-scripts');
  readonly variables = this.root.getByTestId('execution-context-variables');
  readonly asserts = this.root.getByTestId('execution-context-asserts');
  readonly tests = this.root.getByTestId('execution-context-tests');

  script(label: string): Locator {
    return this.scripts.getByText(label);
  }

  variable(name: string): Locator {
    return this.variables.getByText(name, { exact: true });
  }

  assertion(text: string): Locator {
    return this.asserts.getByText(text);
  }

  testCase(name: string): Locator {
    return this.tests.getByText(name);
  }
}
