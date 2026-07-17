import React from 'react';
import Tippy, { type TippyProps } from '@tippyjs/react';
import type { Instance } from 'tippy.js';
import { StyledWrapper } from './StyledWrapper';

export interface DropdownProps extends Omit<TippyProps, 'render' | 'children' | 'content' | 'ref'> {
  /** The trigger element (reference) the popover is anchored to. */
  icon: React.ReactElement;
  /** Popover content rendered inside the styled dropdown surface. */
  children: React.ReactNode;
  /** Mouse handlers applied to the popover surface (used for hover-driven submenus). */
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Tippy-backed popover surface. Ported from bruno-app's `components/Dropdown`.
 * When `visible` is provided the popover is controlled; otherwise it toggles on
 * click. Rendering happens through Tippy's `render` prop so the surface is our
 * own `StyledWrapper` (no base Tippy CSS required).
 */
export const Dropdown: React.FC<DropdownProps> = ({
  icon,
  children,
  onCreate,
  placement,
  visible,
  appendTo,
  onMouseEnter,
  onMouseLeave,
  className,
  ...props
}) => {
  // Default to portaling the popover to <body> so it escapes any `overflow:
  // hidden`/clipping ancestor and z-index/stacking traps. This is safe because
  // the theme lives in `--oc-*` vars on :root, which cascade to body. Tippy's
  // `appendTo` is itself the portal — no separate createPortal is needed.
  const resolvedAppendTo = appendTo ?? (() => document.body);

  // When controlled (visible provided) Tippy must not also manage a trigger.
  const tippyProps: Partial<TippyProps> =
    visible !== undefined
      ? { ...props, visible, interactive: true, appendTo: resolvedAppendTo }
      : { ...props, trigger: 'click', interactive: true, appendTo: resolvedAppendTo };

  return (
    <Tippy
      render={(attrs) => (
        <StyledWrapper
          className={`tippy-box dropdown${className ? ` ${className}` : ''}`}
          tabIndex={-1}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          {...attrs}
        >
          {children}
        </StyledWrapper>
      )}
      placement={placement ?? 'bottom-end'}
      animation={false}
      arrow={false}
      onCreate={onCreate as ((instance: Instance) => void) | undefined}
      {...tippyProps}
    >
      {icon}
    </Tippy>
  );
};

export default Dropdown;
