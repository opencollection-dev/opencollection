import { BaseComponent } from '../base.component';

export class RequestUrlBarComponent extends BaseComponent {
  readonly root = this.page.getByTestId('request-url-bar');

  readonly method = this.root.getByTestId('request-method');
  readonly url = this.root.getByTestId('request-url');
  readonly tryButton = this.root.getByTestId('request-try-button');
}
