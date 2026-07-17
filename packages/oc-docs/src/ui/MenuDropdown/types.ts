import type { ComponentType, ReactElement, ReactNode } from 'react';

/** Props an icon component receives when a section is rendered from a component reference. */
export interface MenuItemIconProps {
  size?: number | string;
  stroke?: number | string;
  className?: string;
  'aria-hidden'?: boolean;
}

/**
 * A left/right section may be:
 * - an icon component (rendered with default icon props), or
 * - a ready-to-render React element / node.
 */
export type MenuItemSection = ComponentType<MenuItemIconProps> | ReactElement | ReactNode;

/** Kind of row rendered in the menu. */
export type MenuItemKind = 'item' | 'label' | 'divider';

/** Rendering style propagated from a group down to its items. */
export type MenuGroupStyle = 'action' | 'select';

/** Menu item identifiers are compared as strings via `data-item-id`. */
export type MenuItemId = string | number;

export interface MenuDropdownItem {
  /** Unique identifier. Required for `item`s; optional for labels/dividers. */
  id?: MenuItemId;
  /** Row kind. Defaults to `'item'`. */
  type?: MenuItemKind;
  /** Rendered on the left side (icon component or element). Items only. */
  leftSection?: MenuItemSection;
  /** Rendered on the right side (icon component or element). Items only. */
  rightSection?: MenuItemSection;
  /** Display text for items, or the label text for `label` rows. */
  label?: ReactNode;
  /** Accessibility label; falls back to `label`/`title` when omitted. */
  ariaLabel?: string;
  onClick?: () => void;
  /** Tooltip text; falls back to `label`/`ariaLabel` when omitted. */
  title?: string;
  testId?: string;
  disabled?: boolean;
  className?: string;
  /** Nested submenu items; the submenu opens on hover. */
  submenu?: MenuDropdownItem[];
  /** Rendering style, propagated from the parent group. */
  groupStyle?: MenuGroupStyle;
}

/** Grouped input format: each group renders its `name` as a label followed by its options. */
export interface MenuDropdownGroup {
  name?: string;
  options: MenuDropdownItem[];
}

/** Accepted `items` shapes: the standard flat format or the grouped format. */
export type MenuDropdownItems = MenuDropdownItem[] | MenuDropdownGroup[];

/** Imperative handle exposed via `ref`. */
export interface MenuDropdownHandle {
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

/** Extra DOM props merged into a rendered menu item (e.g. submenu triggers). */
export type MenuItemExtraProps = { className?: string } & Record<string, unknown>;

/** Builds the shared DOM props for a menu item row. */
export type GetMenuItemProps = (item: MenuDropdownItem, extraProps?: MenuItemExtraProps) => Record<string, unknown>;

/** Renders the inner content (left section, label, right/arrow content) of a menu item. */
export type RenderMenuItemContent = (item: MenuDropdownItem, rightContent?: ReactNode) => ReactElement;
