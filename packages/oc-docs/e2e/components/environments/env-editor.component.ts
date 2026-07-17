import { BaseComponent } from '../base.component';

export class EnvEditorComponent extends BaseComponent {
  readonly cards = this.page.getByTestId('env-var-cards');
  readonly nameInputs = this.cards.getByPlaceholder('Name');
  readonly valueInputs = this.cards.getByPlaceholder('Value');
}
