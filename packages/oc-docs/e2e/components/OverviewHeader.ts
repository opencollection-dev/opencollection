import { BaseComponent } from './BaseComponent';

/** Overview headline: the version label and the collection name/title. */
export class OverviewHeader extends BaseComponent {
  readonly version = this.page.getByTestId('overview-version');
  readonly title = this.page.getByTestId('overview-title');
}
