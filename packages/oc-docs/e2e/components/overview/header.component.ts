import { BaseComponent } from '../base.component';

/** Overview headline: the version label and the collection name/title. */
export class HeaderComponent extends BaseComponent {
  readonly version = this.page.getByTestId('overview-version');
  readonly title = this.page.getByTestId('overview-title');
}
