import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * A block of rendered Markdown — headings, paragraphs, lists, tables, code and
 * quotes.
 */
export class MarkdownComponent extends BaseComponent {
  heading(text: string): Locator {
    return this.root.getByRole('heading', { name: text });
  }

  paragraph(text: string): Locator {
    return this.root.getByRole('paragraph').filter({ hasText: text });
  }

  /** An item in a numbered (ordered) list. */
  numberedItem(text: string): Locator {
    return this.root.locator('ol > li', { hasText: text });
  }

  /** An item in a bulleted (unordered) list. */
  bulletedItem(text: string): Locator {
    return this.root.locator('ul > li', { hasText: text });
  }

  /** Bold (`**…**`) text. */
  boldText(text: string): Locator {
    return this.root.locator('strong', { hasText: text });
  }

  /** Inline or fenced code. */
  code(text: string): Locator {
    return this.root.locator('code', { hasText: text });
  }

  table(): Locator {
    return this.root.getByRole('table');
  }

  columnHeader(text: string): Locator {
    return this.table().getByRole('columnheader', { name: text });
  }

  /** A table cell, matched exactly. */
  cell(text: string): Locator {
    return this.table().getByRole('cell', { name: text, exact: true });
  }
}
