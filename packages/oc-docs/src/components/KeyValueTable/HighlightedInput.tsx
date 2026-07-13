import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '../../ui/Portal/Portal';
import { VariableInfoCard } from '../../components/VariableInfoCard/VariableInfoCard';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { classifyVariableToken } from '../../utils/variableHighlight';
import {
  buildAnywordSuggestions,
  buildVariableSuggestions,
  getVariableContext,
  getWordContext,
  type AutocompleteContext
} from '../../utils/variableAutocomplete';
import { GAP, HOVER_CLOSE_MS, HOVER_OPEN_MS, VIEWPORT_MARGIN } from '../../constants/ui';

interface HighlightedInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  isFound: (name: string) => boolean;
  names: string[];
  anywordHints?: string[];
  title?: string;
}

interface HoveredToken {
  name: string;
  rect: DOMRect;
}

interface Autocomplete {
  items: string[];
  active: number;
  start: number;
  caret: number;
}

interface Coords {
  top: number;
  left: number;
  width?: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

const renderTokens = (text: string, isFound: (name: string) => boolean) =>
  text.split(templateVariableSplitRegex()).map((part, index) => {
    if (part && isTemplateVariable(part)) {
      return (
        <span key={index} className={classifyVariableToken(part.slice(2, -2), isFound)}>
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });

/**
 * A single-line text input that paints `{{var}}` tokens in Bruno's variable
 * colours, shows the variable info card on hover, and offers autocomplete for
 * both `{{variables}}` and a static word list (`anywordHints` — e.g. HTTP header
 * names or MIME types, matching Bruno's name/value cells). The real <input>
 * carries a transparent text fill above a read-only mirror that paints the
 * tokens, so caret/selection/typing stay native; hover is resolved by
 * hit-testing the pointer against the mirror's valid/invalid token rects.
 */
export const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value,
  onValueChange,
  placeholder,
  isFound,
  names,
  anywordHints,
  title
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCaret = useRef<number | null>(null);
  const justTypedRef = useRef(false);

  const [hovered, setHovered] = useState<HoveredToken | null>(null);
  const [hoverPos, setHoverPos] = useState<Coords | null>(null);
  const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null);
  const [autocomplete, setAutocomplete] = useState<Autocomplete | null>(null);
  const [listPos, setListPos] = useState<Coords | null>(null);
  const [listEl, setListEl] = useState<HTMLUListElement | null>(null);

  const cancelOpen = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelOpen();
    if (closeTimer.current) return;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setHovered(null);
    }, HOVER_CLOSE_MS);
  }, [cancelOpen]);

  useEffect(
    () => () => {
      cancelOpen();
      cancelClose();
    },
    [cancelOpen, cancelClose]
  );

  useEffect(() => {
    setHovered(null);
    cancelOpen();
    cancelClose();
    if (justTypedRef.current) {
      justTypedRef.current = false;
    } else {
      setAutocomplete(null);
    }
  }, [value, cancelOpen, cancelClose]);

  useLayoutEffect(() => {
    if (pendingCaret.current !== null && inputRef.current) {
      const caret = pendingCaret.current;
      pendingCaret.current = null;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(caret, caret);
    }
  }, [value]);

  useLayoutEffect(() => {
    if (!hovered || !cardEl) {
      setHoverPos(null);
      return;
    }
    const { innerWidth, innerHeight } = window;
    const cardWidth = cardEl.offsetWidth;
    const cardHeight = cardEl.offsetHeight;
    const roomBelow = innerHeight - hovered.rect.bottom - GAP;
    const roomAbove = hovered.rect.top - GAP;
    const preferAbove = cardHeight > roomBelow && roomAbove > roomBelow;
    const top = preferAbove ? hovered.rect.top - GAP - cardHeight : hovered.rect.bottom + GAP;
    setHoverPos({
      top: clamp(top, VIEWPORT_MARGIN, innerHeight - VIEWPORT_MARGIN - cardHeight),
      left: clamp(hovered.rect.left, VIEWPORT_MARGIN, innerWidth - VIEWPORT_MARGIN - cardWidth)
    });
  }, [hovered, cardEl]);

  useLayoutEffect(() => {
    if (!autocomplete || !listEl || !inputRef.current) {
      setListPos(null);
      return;
    }
    const rect = inputRef.current.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;
    const listHeight = listEl.offsetHeight;
    const roomBelow = innerHeight - rect.bottom - GAP;
    const preferAbove = listHeight > roomBelow && rect.top - GAP > roomBelow;
    const top = preferAbove ? rect.top - GAP - listHeight : rect.bottom + GAP;
    setListPos({
      top: clamp(top, VIEWPORT_MARGIN, innerHeight - VIEWPORT_MARGIN - listHeight),
      left: clamp(rect.left, VIEWPORT_MARGIN, innerWidth - VIEWPORT_MARGIN - rect.width),
      width: rect.width
    });
  }, [autocomplete, listEl]);

  useEffect(() => {
    listEl?.querySelector<HTMLElement>('.highlight-input-suggestion.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [autocomplete, listEl]);

  const contextAt = (text: string, caret: number): AutocompleteContext | null => {
    const before = text.slice(0, caret);
    const variable = getVariableContext(before);
    if (variable) return variable.word ? variable : null;
    if (anywordHints && anywordHints.length) {
      const word = getWordContext(before);
      return word.word ? word : null;
    }
    return null;
  };

  const refreshAutocomplete = (nextValue: string, caret: number) => {
    const before = nextValue.slice(0, caret);
    const variable = getVariableContext(before);
    if (variable) {
      const items = variable.word ? buildVariableSuggestions(variable.word, names) : [];
      setAutocomplete(items.length ? { items, active: 0, start: variable.start, caret } : null);
      return;
    }
    if (anywordHints && anywordHints.length) {
      const word = getWordContext(before);
      const items = word.word ? buildAnywordSuggestions(word.word, anywordHints) : [];
      setAutocomplete(items.length ? { items, active: 0, start: word.start, caret } : null);
      return;
    }
    setAutocomplete(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const caret = event.target.selectionStart ?? nextValue.length;
    justTypedRef.current = true;
    onValueChange(nextValue);
    refreshAutocomplete(nextValue, caret);
  };

  const accept = (name: string): boolean => {
    const caret = inputRef.current?.selectionStart ?? autocomplete?.caret ?? value.length;
    const context = contextAt(value, caret);
    if (!context) {
      setAutocomplete(null);
      return false;
    }
    const nextValue = value.slice(0, context.start) + name + value.slice(caret);
    pendingCaret.current = nextValue === value ? null : context.start + name.length;
    setAutocomplete(null);
    onValueChange(nextValue);
    return true;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!autocomplete) return;
    const { items, active } = autocomplete;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setAutocomplete({ ...autocomplete, active: (active + 1) % items.length });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setAutocomplete({ ...autocomplete, active: (active - 1 + items.length) % items.length });
        break;
      case 'Enter':
      case 'Tab':
        if (accept(items[active])) event.preventDefault();
        break;
      case 'Escape':
        event.preventDefault();
        setAutocomplete(null);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        setAutocomplete(null);
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    const { clientX, clientY } = event;
    const spans = mirror.querySelectorAll<HTMLElement>('.variable-valid, .variable-invalid');
    let match: HoveredToken | null = null;
    for (const span of Array.from(spans)) {
      const rect = span.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        const name = (span.textContent ?? '').slice(2, -2);
        if (name.trim()) match = { name, rect };
        break;
      }
    }
    if (!match) {
      if (hovered) scheduleClose();
      else cancelOpen();
      return;
    }
    cancelClose();
    if (hovered && hovered.name === match.name) return;
    cancelOpen();
    const next = match;
    openTimer.current = setTimeout(() => setHovered(next), HOVER_OPEN_MS);
  };

  return (
    <div className="highlight-input" onMouseMove={handleMouseMove} onMouseLeave={scheduleClose}>
      <div className="highlight-input-mirror" aria-hidden="true" ref={mirrorRef}>
        {renderTokens(value, isFound)}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="text-input"
        value={value}
        title={title}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={() => setAutocomplete(null)}
        onBlur={() => setAutocomplete(null)}
        onScroll={(event) => {
          if (mirrorRef.current) mirrorRef.current.scrollLeft = event.currentTarget.scrollLeft;
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {hovered && (
        <Portal>
          <div
            ref={setCardEl}
            className="highlight-input-hover"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{
              top: hoverPos ? hoverPos.top : -9999,
              left: hoverPos ? hoverPos.left : -9999,
              visibility: hoverPos ? 'visible' : 'hidden'
            }}
          >
            <VariableInfoCard name={hovered.name} />
          </div>
        </Portal>
      )}
      {autocomplete && (
        <Portal>
          <ul
            ref={setListEl}
            className="highlight-input-suggestions"
            role="listbox"
            data-testid="variable-autocomplete"
            style={{
              top: listPos ? listPos.top : -9999,
              left: listPos ? listPos.left : -9999,
              minWidth: listPos?.width,
              visibility: listPos ? 'visible' : 'hidden'
            }}
          >
            {autocomplete.items.map((item, index) => (
              <li
                key={item}
                role="option"
                aria-selected={index === autocomplete.active}
                className={['highlight-input-suggestion', index === autocomplete.active ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setAutocomplete((current) => (current ? { ...current, active: index } : current))}
                onClick={() => accept(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </Portal>
      )}
    </div>
  );
};

export default HighlightedInput;
