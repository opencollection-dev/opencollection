import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '../../ui/Portal/Portal';
import { VariableInfoCard } from '../VariableInfoCard/VariableInfoCard';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { classifyVariableToken } from '../../utils/variableHighlight';
import {
  buildAnywordSuggestions,
  buildVariableSuggestions,
  getVariableContext,
  getWordContext,
  type AutocompleteContext
} from '../../utils/variableAutocomplete';
import { HOVER_CLOSE_MS, HOVER_OPEN_MS } from '../../constants/ui';
import { computeAnchoredPosition } from '../../utils/anchoredPosition';
import { StyledWrapper, HoverCard, Suggestions } from './StyledWrapper';

interface HighlightedInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  isFound: (name: string) => boolean;
  names: string[];
  anywordHints?: string[];
  variablesAutocomplete?: boolean;
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
 * `{{variables}}` (unless `variablesAutocomplete` is false — the app only suggests
 * variables in value cells, never in param/variable name cells) and a static word
 * list (`anywordHints` — e.g. HTTP header names or MIME types). The real <input>
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
  variablesAutocomplete = true,
  title
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCaret = useRef<number | null>(null);
  const justTypedRef = useRef(false);
  const moveFrame = useRef<number | null>(null);
  const overCardRef = useRef(false);

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
      if (moveFrame.current !== null) cancelAnimationFrame(moveFrame.current);
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

  // Dismiss the portaled hover card / autocomplete on outside scroll or resize, so they never
  // float detached from a cell that moved (the key-value table scrolls). Scrolls that originate
  // inside the overlay itself are ignored.
  useEffect(() => {
    if (!hovered && !autocomplete) return undefined;
    const dismiss = () => {
      if (overCardRef.current) return;
      setHovered(null);
      setAutocomplete(null);
    };
    const onScroll = (event: Event) => {
      const target = event.target as Node | null;
      if (target && (cardEl?.contains(target) || listEl?.contains(target))) return;
      dismiss();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', dismiss);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [hovered, autocomplete, cardEl, listEl]);

  // The card exists only while `hovered` is set, so once it clears the pointer can't be over it.
  useEffect(() => {
    if (!hovered) overCardRef.current = false;
  }, [hovered]);

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
    setHoverPos(computeAnchoredPosition(hovered.rect, cardEl.offsetWidth, cardEl.offsetHeight));
  }, [hovered, cardEl]);

  useLayoutEffect(() => {
    if (!autocomplete || !listEl || !inputRef.current) {
      setListPos(null);
      return;
    }
    const rect = inputRef.current.getBoundingClientRect();
    // Clamp by the anchor width — the list is min-width'd to the input and carries its own width.
    setListPos({ ...computeAnchoredPosition(rect, rect.width, listEl.offsetHeight), width: rect.width });
  }, [autocomplete, listEl]);

  useEffect(() => {
    listEl?.querySelector<HTMLElement>('.highlight-input-suggestion.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [autocomplete, listEl]);

  const contextAt = (text: string, caret: number): AutocompleteContext | null => {
    const before = text.slice(0, caret);
    const variable = getVariableContext(before);
    if (variable) return variablesAutocomplete && variable.word ? variable : null;
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
      const items = variablesAutocomplete && variable.word ? buildVariableSuggestions(variable.word, names) : [];
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
    const { clientX, clientY } = event;
    // Coalesce hit-testing to one frame — the loop measures each token, so running it per
    // mousemove would thrash layout on a cell with several `{{var}}` tokens.
    if (moveFrame.current !== null) return;
    moveFrame.current = requestAnimationFrame(() => {
      moveFrame.current = null;
      const mirror = mirrorRef.current;
      if (!mirror) return;
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
        // If the pointer has moved onto the hover card, leave it open — a frame queued by the
        // last in-input move must not re-close the card once it has been entered.
        if (overCardRef.current) return;
        if (hovered) scheduleClose();
        else cancelOpen();
        return;
      }
      cancelClose();
      if (hovered && hovered.name === match.name) return;
      cancelOpen();
      const next = match;
      openTimer.current = setTimeout(() => setHovered(next), HOVER_OPEN_MS);
    });
  };

  return (
    <StyledWrapper className="highlight-input" onMouseMove={handleMouseMove} onMouseLeave={scheduleClose}>
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
          <HoverCard
            ref={setCardEl}
            onMouseEnter={() => {
              overCardRef.current = true;
              cancelClose();
            }}
            onMouseLeave={() => {
              overCardRef.current = false;
              scheduleClose();
            }}
            style={{
              top: hoverPos ? hoverPos.top : -9999,
              left: hoverPos ? hoverPos.left : -9999,
              visibility: hoverPos ? 'visible' : 'hidden'
            }}
          >
            <VariableInfoCard name={hovered.name} />
          </HoverCard>
        </Portal>
      )}
      {autocomplete && (
        <Portal>
          <Suggestions
            ref={setListEl}
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
          </Suggestions>
        </Portal>
      )}
    </StyledWrapper>
  );
};

export default HighlightedInput;
