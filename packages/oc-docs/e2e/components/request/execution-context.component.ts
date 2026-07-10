import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export type ExecutionContextTab = 'variables' | 'scripts' | 'asserts' | 'tests';

export class ExecutionContextComponent extends BaseComponent {
  readonly root = this.page.getByTestId('execution-context');

  readonly executionFlow = this.root.getByTestId('execution-context-flow');
  readonly viewCompleteCodeButton = this.root.getByTestId('execution-context-view-complete-code');

  readonly variablesPanel = this.root.getByTestId('execution-context-variables');
  readonly scriptsPanel = this.root.getByTestId('execution-context-scripts');
  readonly assertsPanel = this.root.getByTestId('execution-context-asserts');
  readonly testsPanel = this.root.getByTestId('execution-context-tests');

  tab(name: ExecutionContextTab): Locator {
    return this.root.getByTestId(`execution-context-tabs-tab-${name}`);
  }

  async openTab(name: ExecutionContextTab): Promise<void> {
    await this.tab(name).click();
  }

  scriptStep(label: string): Locator {
    return this.scriptsPanel.getByText(label);
  }

  scriptSource(name: string): Locator {
    return this.scriptsPanel.locator('button.script-step-source').filter({ hasText: name });
  }

  variable(name: string): Locator {
    return this.variablesPanel.getByText(name, { exact: true });
  }

  assertion(text: string): Locator {
    return this.assertsPanel.getByText(text);
  }

  testCase(name: string): Locator {
    return this.testsPanel.getByText(name);
  }
}
