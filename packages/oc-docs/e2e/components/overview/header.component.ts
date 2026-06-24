import { BaseComponent } from '../base.component';

export class HeaderSection extends BaseComponent {
  readonly collectionVersion = this.page.getByTestId('overview-collection-version');
  readonly collectionName = this.page.getByTestId('overview-collection-name');
}
