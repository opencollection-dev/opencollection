import { BaseComponent } from '../base.component';

// The Body tab inside the playground request pane: the body-type dropdown and
// the editor region each type renders. Open the tab via playground.selectTab('body').
export class RequestBodyComponent extends BaseComponent {
  readonly typeSelect = this.page.getByTestId('body-type-select');
  readonly empty = this.page.getByTestId('body-empty');
  readonly multipart = this.page.getByTestId('body-multipart');
  readonly file = this.page.getByTestId('body-file');

  // The body type is a MenuDropdown: open the trigger, then click the option.
  // Options are portaled to document.body, so locate them from the page root.
  async selectType(value: string): Promise<void> {
    await this.typeSelect.click();
    await this.page.getByTestId(`body-type-select-${value}`).click();
  }
}
