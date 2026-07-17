import React, { forwardRef, useRef, useCallback, useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { IconChevronDown } from '@tabler/icons';
import type { Instance, Placement } from 'tippy.js';
import Dropdown, { type DropdownProps } from './Dropdown';
import SubMenuItem from './SubMenuItem';
import { TriggerButton } from './StyledWrapper';
import type {
  MenuDropdownItem,
  MenuDropdownGroup,
  MenuDropdownItems,
  MenuDropdownHandle,
  MenuItemId,
  MenuItemSection,
  MenuItemIconProps,
  MenuGroupStyle,
  MenuItemExtraProps
} from './types';

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'];
const ACTION_KEYS = ['Enter', ' '];

const getNextIndex = (currentIndex: number, total: number, key: string, noFocus: boolean): number => {
  if (key === 'Home') return 0;
  if (key === 'End') return total - 1;
  if (key === 'ArrowDown') return noFocus ? 0 : (currentIndex + 1) % total;
  if (key === 'ArrowUp') return noFocus ? total - 1 : (currentIndex - 1 + total) % total;
  return currentIndex;
};

export interface MenuDropdownProps extends Omit<
  DropdownProps,
  'icon' | 'children' | 'visible' | 'onCreate' | 'onClickOutside'
> {
  items?: MenuDropdownItems;
  /**
   * Optional trigger element (button, etc.). When omitted, MenuDropdown renders
   * a default trigger that displays the currently selected item.
   */
  children?: React.ReactNode;
  /**
   * How to derive the display text for the default trigger from a selected item.
   * Only used when `children` is not provided. If the item is a string it is
   * rendered directly; otherwise this maps the item object to display text.
   * Defaults to the item's `label`.
   */
  itemToText?: (item: MenuDropdownItem) => React.ReactNode;
  /** Tippy placement. Defaults to `'bottom-end'`. */
  placement?: Placement;
  /** Optional className for the dropdown surface. */
  className?: string;
  /** ID of the selected/active item to focus on open and mark active. */
  selectedItemId?: MenuItemId | null;
  /** ARIA role family: 'menu' (default) for action menus; 'listbox' for single-select value pickers. */
  role?: 'menu' | 'listbox';
  /** Controlled open state. When provided, the component is controlled. */
  opened?: boolean;
  /** Called when the dropdown open state changes. */
  onChange?: (opened: boolean) => void;
  /** Optional header content rendered above the menu items. */
  header?: React.ReactNode;
  /** Optional footer content rendered below the menu items. */
  footer?: React.ReactNode;
  /** Show a checkmark (✓) on the selected item. Defaults to `true`. */
  showTickMark?: boolean;
  /** Show dividers between groups in the grouped format. Defaults to `true`. */
  showGroupDividers?: boolean;
  /** Group rendering style: `'action'` (default) or `'select'` (uppercase labels, indented items). */
  groupStyle?: MenuGroupStyle;
  /** Auto-focus the first option when the dropdown opens. Defaults to `false`. */
  autoFocusFirstOption?: boolean;
  /** Submenu placement/arrow direction: `'right'` (default) or `'left'`. */
  submenuPlacement?: 'right' | 'left';
  testId?: string;
}

// Type guard: distinguishes the grouped input format from the flat format.
const isGroupedItems = (items: MenuDropdownItems): items is MenuDropdownGroup[] => {
  const first = items[0];
  return first != null && typeof first === 'object' && 'options' in first;
};

/**
 * MenuDropdown - A reusable dropdown menu component with keyboard navigation.
 *
 * Ported from bruno-app. Supports the standard flat item format, a grouped
 * format (`[{ name, options }]`), nested submenus, controlled/uncontrolled open
 * state, keyboard navigation, and an imperative `show`/`hide`/`toggle` handle.
 */
const MenuDropdown = forwardRef<MenuDropdownHandle, MenuDropdownProps>(
  (
    {
      items = [],
      children,
      placement = 'bottom-end',
      className,
      selectedItemId,
      role = 'menu',
      opened,
      onChange,
      header,
      footer,
      showTickMark = true,
      showGroupDividers = true,
      groupStyle = 'action',
      autoFocusFirstOption = false,
      submenuPlacement = 'right',
      itemToText,
      testId,
      ...dropdownProps
    },
    ref
  ) => {
    const tippyRef = useRef<Instance | null>(null);
    const selectedItemIdRef = useRef<MenuItemId | null | undefined>(selectedItemId);
    const autoFocusFirstOptionRef = useRef<boolean>(autoFocusFirstOption);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    useEffect(() => {
      selectedItemIdRef.current = selectedItemId;
    }, [selectedItemId]);

    useEffect(() => {
      autoFocusFirstOptionRef.current = autoFocusFirstOption;
    }, [autoFocusFirstOption]);

    const isControlled = opened !== undefined;

    const isOpen = isControlled ? opened : internalIsOpen;

    const itemRole = role === 'listbox' ? 'option' : 'menuitem';

    const getMenuItems = useCallback((): HTMLElement[] => {
      const popper = tippyRef.current?.popper;
      if (!popper) return [];

      const menuContainer = popper.querySelector('.menu-dropdown-list');
      if (!menuContainer) return [];

      return Array.from(menuContainer.querySelectorAll<HTMLElement>('[data-item-id]:not([aria-disabled="true"])'));
    }, []);

    const updateOpenState = useCallback(
      (newState: boolean) => {
        if (isControlled) {
          onChange?.(newState);
        } else {
          setInternalIsOpen(newState);
        }
      },
      [isControlled, onChange]
    );

    const handleItemClick = useCallback(
      (item: MenuDropdownItem) => {
        if (item.disabled) return;
        item.onClick?.();
        updateOpenState(false);
      },
      [updateOpenState]
    );

    const normalizeItems = useCallback(
      (itemsToNormalize: MenuDropdownItems): MenuDropdownItem[] => {
        if (!Array.isArray(itemsToNormalize) || itemsToNormalize.length === 0) {
          return [];
        }

        if (isGroupedItems(itemsToNormalize)) {
          const result: MenuDropdownItem[] = [];
          itemsToNormalize.forEach((group, groupIndex) => {
            if (groupIndex > 0 && showGroupDividers) {
              result.push({ type: 'divider', id: `divider-${groupIndex}` });
            }

            if (group.name) {
              const normalizedGroupName = group.name.toLowerCase().replace(/ /g, '-');
              result.push({
                type: 'label',
                id: `label-${normalizedGroupName}-${groupIndex}`,
                label: group.name,
                groupStyle
              });
            }

            group.options.forEach((option) => {
              result.push({
                id: option.id,
                label: option.label,
                type: 'item',
                onClick: option.onClick,
                disabled: option.disabled,
                className: option.className,
                leftSection: option.leftSection,
                rightSection: option.rightSection,
                ariaLabel: option.ariaLabel,
                title: option.title,
                submenu: option.submenu,
                groupStyle
              });
            });
          });
          return result;
        }

        return itemsToNormalize;
      },
      [showGroupDividers, groupStyle]
    );

    const normalizedItems = useMemo(() => normalizeItems(items), [items, normalizeItems]);

    const enhancedItems = useMemo(() => {
      if (!showTickMark || selectedItemId == null) {
        return normalizedItems;
      }

      return normalizedItems.map((item) => {
        if (item.type && item.type !== 'item') {
          return item;
        }

        const isSelected = item.id === selectedItemId;

        // Only add tick mark if item is selected and doesn't already have a rightSection
        if (isSelected && !item.rightSection) {
          return {
            ...item,
            rightSection: <span className="ml-auto">✓</span>
          };
        }

        return item;
      });
    }, [normalizedItems, showTickMark, selectedItemId]);

    // The currently selected item (used to render the default trigger).
    const selectedItem = useMemo(() => {
      if (selectedItemId == null) return undefined;
      return normalizedItems.find(
        (item) =>
          (item.type == null || item.type === 'item') && item.id != null && String(item.id) === String(selectedItemId)
      );
    }, [normalizedItems, selectedItemId]);

    // Resolve display text for the default trigger: strings render directly,
    // objects go through `itemToText` (falling back to the item's label).
    const resolveItemText = (item?: MenuDropdownItem | string): React.ReactNode => {
      if (item == null) return null;
      if (typeof item === 'string') return item;
      if (itemToText) return itemToText(item);
      return item.label ?? null;
    };

    const clearFocusedClass = (menuContainer: Element | null) => {
      if (menuContainer) {
        menuContainer.querySelectorAll('.dropdown-item-focused').forEach((el) => {
          el.classList.remove('dropdown-item-focused');
        });
      }
    };

    const focusMenuItem = (item: HTMLElement | undefined, addFocusedClass = true) => {
      if (item) {
        const menuContainer = item.closest('.menu-dropdown-list');
        clearFocusedClass(menuContainer);

        if (addFocusedClass) {
          item.classList.add('dropdown-item-focused');
        }
        item.focus();
        // scrollIntoView may not be available in test environments (jsdom)
        if (typeof item.scrollIntoView === 'function') {
          item.scrollIntoView({ block: 'nearest' });
        }
      }
    };

    const handleMenuKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const itemsToNavigate = getMenuItems();
        if (itemsToNavigate.length === 0) return;

        const currentIndex = itemsToNavigate.findIndex((el) => el === document.activeElement);
        const isNoMenuItemFocused = currentIndex === -1;

        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          updateOpenState(false);
          return;
        }

        if (ACTION_KEYS.includes(e.key) && !isNoMenuItemFocused) {
          e.preventDefault();
          e.stopPropagation();
          const currentItem = itemsToNavigate[currentIndex];
          const itemId = currentItem?.getAttribute('data-item-id');
          const item = enhancedItems.find((i) => String(i.id) === itemId);
          if (item && !item.disabled) {
            handleItemClick(item);
          }
          return;
        }

        if (NAVIGATION_KEYS.includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          const nextIndex = getNextIndex(currentIndex, itemsToNavigate.length, e.key, isNoMenuItemFocused);
          focusMenuItem(itemsToNavigate[nextIndex], true);
        }
      },
      // focusMenuItem is a stable render-local helper and intentionally omitted.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [getMenuItems, enhancedItems, handleItemClick, updateOpenState]
    );

    const handleTriggerClick = useCallback(() => {
      updateOpenState(!isOpen);
    }, [isOpen, updateOpenState]);

    const handleClickOutside = useCallback(
      (_instance: Instance, event: Event) => {
        // Don't close if clicking inside a submenu (another tippy popper)
        const target = event?.target;
        if (target instanceof Element && target.closest('[data-tippy-root]')) {
          return;
        }
        updateOpenState(false);
      },
      [updateOpenState]
    );

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          updateOpenState(true);
        },
        hide: () => {
          updateOpenState(false);
        },
        toggle: () => {
          updateOpenState(!isOpen);
        }
      }),
      [updateOpenState, isOpen]
    );

    const onDropdownCreate = useCallback((instance: Instance | null) => {
      tippyRef.current = instance;
      if (instance) {
        instance.setProps({
          onShow: () => {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
              const menuContainer = instance.popper?.querySelector('.menu-dropdown-list');
              if (!menuContainer) return;

              const menuItems = Array.from(
                menuContainer.querySelectorAll<HTMLElement>('[data-item-id]:not([aria-disabled="true"])')
              );

              // Use ref to get the latest value
              const currentSelectedItemId = selectedItemIdRef.current;
              if (currentSelectedItemId != null) {
                // Convert to string for comparison since data attributes are always strings
                const selectedItemIdStr = String(currentSelectedItemId);
                const selectedItem = menuItems.find((item) => item.getAttribute('data-item-id') === selectedItemIdStr);

                if (selectedItem) {
                  focusMenuItem(selectedItem, true);
                  return;
                }
              }

              if (autoFocusFirstOptionRef.current && menuItems.length > 0) {
                focusMenuItem(menuItems[0], true);
                return;
              }

              // Fallback: focus menu container
              (menuContainer as HTMLElement).focus();
            });
          },
          onHide: () => {
            const menuContainer = instance.popper?.querySelector('.menu-dropdown-list');
            clearFocusedClass(menuContainer);
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderSection = (section?: MenuItemSection): React.ReactNode => {
      if (!section) return null;

      if (typeof section === 'function') {
        const SectionComponent = section as React.ComponentType<MenuItemIconProps>;
        return <SectionComponent size={16} stroke={1.5} className="dropdown-icon" aria-hidden />;
      }

      return section as React.ReactNode;
    };

    const getMenuItemProps = (item: MenuDropdownItem, extraProps: MenuItemExtraProps = {}): Record<string, unknown> => {
      const selectIndentClass = item.groupStyle === 'select' ? 'dropdown-item-select' : '';
      const isActive = item.id === selectedItemId;
      const activeClass = isActive ? 'dropdown-item-active' : '';

      // Destructure className from extraProps to avoid it being overwritten by spread
      const { className: extraClassName, ...restExtraProps } = extraProps;

      return {
        className: `dropdown-item ${item.disabled ? 'disabled' : ''} ${selectIndentClass} ${activeClass} ${
          extraClassName ?? ''
        } ${item.className ?? ''}`.trim(),
        role: itemRole,
        'data-item-id': item.id,
        tabIndex: item.disabled ? -1 : role === 'listbox' ? (isActive ? 0 : -1) : 0,
        'aria-label': item.ariaLabel,
        'aria-disabled': item.disabled,
        ...(role === 'listbox' ? { 'aria-selected': isActive } : { 'aria-current': isActive ? 'true' : undefined }),
        title: item.title,
        'data-testid': testId && `${testId}-${String(item.id).toLowerCase()}`,
        ...restExtraProps
      };
    };

    const renderMenuItemContent = (
      item: MenuDropdownItem,
      rightContent: React.ReactNode = null
    ): React.ReactElement => (
      <>
        {renderSection(item.leftSection)}
        <span className="dropdown-label">{item.label}</span>
        {rightContent}
      </>
    );

    const renderMenuItem = (item: MenuDropdownItem): React.ReactNode => {
      if (item.submenu) {
        return (
          <SubMenuItem
            key={item.id}
            item={item}
            selectedItemId={selectedItemId ?? null}
            showTickMark={showTickMark}
            onRootClose={() => updateOpenState(false)}
            submenuPlacement={submenuPlacement}
            getMenuItemProps={getMenuItemProps}
            renderMenuItemContent={renderMenuItemContent}
            MenuDropdownComponent={MenuDropdown}
          />
        );
      }

      const itemProps = getMenuItemProps(item);

      const rightContent = item.rightSection ? (
        <div
          className="dropdown-right-section"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {renderSection(item.rightSection)}
        </div>
      ) : null;

      return (
        <div
          key={item.id}
          {...(itemProps as unknown as React.HTMLAttributes<HTMLDivElement>)}
          onClick={() => !item.disabled && handleItemClick(item)}
        >
          {renderMenuItemContent(item, rightContent)}
        </div>
      );
    };

    const renderLabel = (item: MenuDropdownItem): React.ReactNode => {
      const labelText = typeof item.label === 'string' ? item.label : '';
      return (
        <div
          key={item.id ?? `label-${labelText}`}
          className={`label-item ${item.groupStyle === 'select' ? 'label-select' : ''}`}
          role="presentation"
          data-testid={testId && `${testId}-label-${labelText.toLowerCase().replace(/ /g, '-')}`}
        >
          {item.groupStyle === 'select' ? labelText.toUpperCase() : (item.label ?? '')}
        </div>
      );
    };

    const renderDivider = (item: MenuDropdownItem, index: number): React.ReactNode => (
      <div key={item.id ?? `divider-${index}`} className="dropdown-separator" role="separator" />
    );

    const renderMenuContent = (): React.ReactNode => {
      let dividerIndex = 0;

      return enhancedItems.map((item) => {
        const itemType = item.type || 'item';

        if (itemType === 'label') {
          return renderLabel(item);
        }

        if (itemType === 'divider') {
          return renderDivider(item, dividerIndex++);
        }

        return renderMenuItem(item);
      });
    };

    let triggerElement: React.ReactElement;
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      const triggerProps: React.HTMLAttributes<HTMLElement> & { 'data-testid'?: string } = {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleTriggerClick();
        },
        'aria-expanded': isOpen,
        'aria-haspopup': role,
        'data-testid': testId
      };
      triggerElement = React.cloneElement(child, triggerProps);
    } else if (children != null) {
      triggerElement = (
        <div onClick={handleTriggerClick} aria-expanded={isOpen} aria-haspopup={role} data-testid={testId}>
          {children}
        </div>
      );
    } else {
      // No trigger supplied: render a default trigger showing the selected item.
      triggerElement = (
        <TriggerButton
          type="button"
          className="menu-dropdown-trigger"
          onClick={handleTriggerClick}
          aria-expanded={isOpen}
          aria-haspopup={role}
          data-testid={testId}
        >
          <span className="menu-dropdown-trigger-label">{resolveItemText(selectedItem)}</span>
          <IconChevronDown size={14} className="menu-dropdown-trigger-chevron" aria-hidden />
        </TriggerButton>
      );
    }

    return (
      <Dropdown
        onCreate={onDropdownCreate}
        icon={triggerElement}
        placement={placement}
        className={className}
        visible={isOpen}
        onClickOutside={handleClickOutside}
        {...dropdownProps}
      >
        <div data-testid={testId && `${testId}-dropdown`}>
          {header && (
            <div className="dropdown-header-container">
              {header}
              <div className="dropdown-divider"></div>
            </div>
          )}
          <div role={role} className="menu-dropdown-list" tabIndex={-1} onKeyDown={handleMenuKeyDown}>
            {renderMenuContent()}
          </div>
          {footer && (
            <>
              <div className="dropdown-divider"></div>
              <div className="dropdown-footer-container">{footer}</div>
            </>
          )}
        </div>
      </Dropdown>
    );
  }
);

MenuDropdown.displayName = 'MenuDropdown';

/** The `MenuDropdown` component type, used where it is passed as a prop (e.g. submenus). */
export type MenuDropdownComponentType = typeof MenuDropdown;

export default MenuDropdown;
