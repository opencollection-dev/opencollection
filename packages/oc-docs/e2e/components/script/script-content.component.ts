import { BaseComponent } from '../base.component';

export class ScriptContentComponent extends BaseComponent {
  readonly root = this.page.getByTestId('script-code');

  readonly code = this.root.locator('code');

  readonly copyButton = this.root.getByTestId('script-code-copy');
}
