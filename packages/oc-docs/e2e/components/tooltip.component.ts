import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class TooltipComponent extends BaseComponent {
  readonly truncatableCells: Locator;

  readonly popup: Locator;

  constructor(page: Page) {
    super(page);
    this.truncatableCells = page.getByTestId('truncated-text');
    this.popup = page.getByTestId('tooltip');
  }

  /** The index and full text of the first cell whose text is clipped, or null if none is clipped. */
  async findFirstClippedCell(): Promise<{ index: number; fullText: string } | null> {
    return this.truncatableCells.evaluateAll<{ index: number; fullText: string } | null, HTMLElement>((cells) => {
      const clippedIndex = cells.findIndex((cell) => cell.scrollWidth > cell.clientWidth + 1);
      if (clippedIndex < 0) return null;
      return { index: clippedIndex, fullText: (cells[clippedIndex].textContent || '').trim() };
    });
  }

  /** The index of the first cell whose text fits within its width, or -1 if every cell is clipped. */
  async findFirstUnclippedCellIndex(): Promise<number> {
    return this.truncatableCells.evaluateAll<number, HTMLElement>((cells) =>
      cells.findIndex((cell) => cell.scrollWidth <= cell.clientWidth + 1)
    );
  }

  /** Hover the truncatable cell at `index` to trigger (or suppress) its tooltip. */
  async hoverCell(index: number): Promise<void> {
    await this.truncatableCells.nth(index).hover();
  }
}
