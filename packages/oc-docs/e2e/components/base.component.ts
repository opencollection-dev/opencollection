import type { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  readonly root: Locator;
  private dragY = 0;

  constructor(protected readonly page: Page, root?: Locator) {
    this.root = root ?? page.locator(':root');
  }

  /** Press the pointer on a resize handle; the drag y is kept for later moves. */
  protected async grabHandle(handle: Locator): Promise<void> {
    const box = await handle.boundingBox();
    this.dragY = (box?.y ?? 0) + (box?.height ?? 0) / 2;
    await handle.hover();
    await this.page.mouse.down();
  }

  /** Move the held pointer to an absolute x (keeps the grabbed y). */
  async movePointerToX(x: number): Promise<void> {
    await this.page.mouse.move(x, this.dragY, { steps: 10 });
  }

  async releasePointer(): Promise<void> {
    await this.page.mouse.up();
  }
}
