/**
 * `@tabler/icons` v1 ships its React components at `icons-react/`, but its
 * package.json `exports` map doesn't expose the bundled `.d.ts` under
 * TypeScript's `bundler` module resolution — so bare imports resolve to `any`
 * (TS7016). This ambient declaration types the icons we consume as React
 * components. Extend the list if new icons are imported.
 */
declare module '@tabler/icons' {
  import type { FunctionComponent, SVGProps } from 'react';

  export interface TablerIconProps extends Partial<SVGProps<SVGSVGElement>> {
    size?: number | string;
    stroke?: number | string;
    title?: string;
  }

  export type TablerIcon = FunctionComponent<TablerIconProps>;

  export const IconChevronDown: TablerIcon;
  export const IconChevronRight: TablerIcon;
  export const IconChevronLeft: TablerIcon;
  export const IconCaretDown: TablerIcon;
  export const IconForms: TablerIcon;
  export const IconBraces: TablerIcon;
  export const IconCode: TablerIcon;
  export const IconFileText: TablerIcon;
  export const IconDatabase: TablerIcon;
  export const IconFile: TablerIcon;
  export const IconX: TablerIcon;
}
