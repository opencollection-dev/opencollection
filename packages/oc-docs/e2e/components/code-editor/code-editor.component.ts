import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * A Monaco-backed code editor (see `src/ui/CodeEditor`). Only the container carries a test id;
 * Monaco renders its own DOM, so the editor surface, the text region we click to focus, and the
 * (portaled) autocomplete popup are matched by Monaco's stable class names and kept out of specs.
 */
export class CodeEditorComponent extends BaseComponent {
  readonly copyButton: Locator;
  readonly suggestions: Locator;
  private readonly surface: Locator;
  private readonly lines: Locator;

  constructor(page: Page, testId: string) {
    super(page, page.getByTestId(testId));
    this.copyButton = this.root.getByTestId(`${testId}-copy`);
    this.surface = this.root.locator('.monaco-editor');
    this.lines = this.root.locator('.view-lines');
    this.suggestions = page.locator('.suggest-widget.visible');
  }

  async focus(): Promise<void> {
    await this.surface.waitFor({ state: 'visible', timeout: 20000 });
    await this.lines.click();
  }
}
