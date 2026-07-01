import { BaseComponent } from '../base.component';

export class FolderConfigurationComponent extends BaseComponent {
  readonly root = this.page.getByTestId('folder-config');
  readonly headers = this.page.getByTestId('folder-config-headers');
  readonly auth = this.page.getByTestId('folder-config-auth');
  readonly script = this.page.getByTestId('folder-config-script');
  readonly vars = this.page.getByTestId('folder-config-vars');
  readonly tests = this.page.getByTestId('folder-config-tests');
}
