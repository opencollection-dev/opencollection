import { BaseComponent } from './base.component';

export class CopyButtonComponent extends BaseComponent {
  /** Copy to the clipboard. */
  async click(): Promise<void> {
    await this.root.click();
  }
}
