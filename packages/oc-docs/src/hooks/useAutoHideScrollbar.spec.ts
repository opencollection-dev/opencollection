import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { attachAutoHideScrollbar } from './useAutoHideScrollbar';

type Handler = () => void;

/** Minimal fake element: records classList ops and captures event handlers. */
function makeEl() {
  const handlers: Record<string, Handler> = {};
  const classList = {
    add: vi.fn<(c: string) => void>(),
    remove: vi.fn<(c: string) => void>(),
  };
  const el = {
    classList,
    addEventListener: vi.fn((type: string, fn: Handler) => {
      handlers[type] = fn;
    }),
    removeEventListener: vi.fn((type: string) => {
      delete handlers[type];
    }),
  };
  return { el: el as unknown as HTMLElement, handlers, classList, ...el };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('attachAutoHideScrollbar', () => {
  it('registers mousemove + scroll listeners', () => {
    const f = makeEl();
    attachAutoHideScrollbar(f.el, 1000);
    expect(f.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(f.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
  });

  it('adds .scrolling on activity and removes it after the idle delay', () => {
    const f = makeEl();
    attachAutoHideScrollbar(f.el, 1000);

    f.handlers.mousemove();
    expect(f.classList.add).toHaveBeenCalledWith('scrolling');
    expect(f.classList.remove).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(f.classList.remove).not.toHaveBeenCalled(); // still within idle window
    vi.advanceTimersByTime(1);
    expect(f.classList.remove).toHaveBeenCalledWith('scrolling'); // 1000ms idle -> hide
  });

  it('resets the idle timer on each new activity (does not hide early)', () => {
    const f = makeEl();
    attachAutoHideScrollbar(f.el, 1000);

    f.handlers.scroll();
    vi.advanceTimersByTime(800);
    f.handlers.scroll(); // resets the 1000ms countdown
    vi.advanceTimersByTime(800); // 800 since reset -> not yet
    expect(f.classList.remove).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200); // now 1000 since the reset
    expect(f.classList.remove).toHaveBeenCalledTimes(1);
  });

  it('cleanup removes both listeners and cancels a pending hide', () => {
    const f = makeEl();
    const cleanup = attachAutoHideScrollbar(f.el, 1000);

    f.handlers.mousemove(); // schedule a hide
    cleanup();
    expect(f.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(f.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));

    vi.advanceTimersByTime(5000);
    expect(f.classList.remove).not.toHaveBeenCalled(); // pending timer was cleared
  });
});
