import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import { useAssistant } from './AssistantProvider';
import { NomaReply } from './NomaReply';
import { demoReply, type DemoReply, type ReplyContext } from './demo/replies';
import { useTrips } from '../../state/TripsProvider';
import { useSaved } from '../../state/SavedProvider';
import { usePreferences } from '../../state/PreferencesProvider';
import styles from './AskNoma.module.css';

type Message =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'noma'; status: 'typing' | 'ready'; reply?: DemoReply; animate: boolean; declined?: boolean };

const TYPING_MS = 650;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Persistent, discreet entry point to the assistant.
 * Collapses to its mark while scrolling down, so it never competes with content.
 *
 * Demo: replies are prepared and context-aware (see ./demo/replies.ts).
 */
export function AskNoma() {
  const { screen, isOpen, open, close, draft, setDraft } = useAssistant();
  const { today, trips, isApplied, applyChange } = useTrips();
  const { entries: saved } = useSaved();
  const { preferences } = usePreferences();

  const [compact, setCompact] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  // Replies are built from the latest app state, not the state at send time.
  const ctxRef = useRef<ReplyContext | null>(null);
  ctxRef.current = {
    screenLabel: screen.label,
    screenSuggestions: screen.suggestions,
    today,
    trips,
    preferences,
    saved,
    isApplied,
  };

  // Collapse on scroll down, expand on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setCompact(y > last && y > 240);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToEnd = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    scrollToEnd();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(scrollToEnd, [messages, scrollToEnd]);

  const handleClose = () => {
    close();
    triggerRef.current?.focus();
  };

  const isBusy = messages.some((m) => m.role === 'noma' && m.status === 'typing');

  /** Add a NOMA reply after a short "typing" pause. */
  const respond = useCallback((build: () => DemoReply) => {
    const id = nextId.current++;
    setMessages((prev) => [...prev, { id, role: 'noma', status: 'typing', animate: !prefersReducedMotion() }]);
    window.setTimeout(() => {
      const reply = build();
      setMessages((prev) => prev.map((m) => (m.id === id && m.role === 'noma' ? { ...m, status: 'ready', reply } : m)));
    }, TYPING_MS);
  }, []);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || isBusy) return;
    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text: q }]);
    setDraft('');
    respond(() => demoReply(q, ctxRef.current!));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  const handleApply = (changeId: string) => {
    applyChange(changeId);
    respond(() => ({
      text: 'Done. Day 03 now ends with a hot spring soak instead of the boat. I cancelled the boat booking, and the refund is already reflected in your budget.\n\nIf the forecast changes, you can undo this from the day itself.',
      links: [
        { label: 'View Day 03', to: '/trips/kyoto?day=3' },
        { label: 'View budget', to: '/trips/kyoto?view=budget' },
      ],
    }));
  };

  const handleDecline = (messageId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId && m.role === 'noma' ? { ...m, declined: true } : m)));
    respond(() => ({
      text: 'No problem, your original plan stays. I’ll check the forecast again the evening before and let you know if it’s worth changing.',
      followUps: ['What if it doesn’t rain?'],
    }));
  };

  const lastNomaId = [...messages].reverse().find((m) => m.role === 'noma')?.id;
  const hasConversation = messages.length > 0;

  return (
    <>
      <div className={cx(styles.backdrop, isOpen && styles.backdropOpen)} onClick={handleClose} aria-hidden="true" />

      <section
        id={panelId}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={cx(styles.panel, isOpen && styles.panelOpen, hasConversation && styles.tall)}
        hidden={!isOpen}
      >
        <header className={styles.panelHeader}>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.panelTitle}>
              Ask NOMA <span className={styles.demo}>Demo</span>
            </h2>
            <p className={styles.context}>
              <span className={styles.contextDot} aria-hidden="true" />
              Looking at <strong>{screen.label}</strong>
            </p>
          </div>
          <div className={styles.headerActions}>
            {hasConversation && (
              <button type="button" className={styles.newChat} onClick={() => setMessages([])} disabled={isBusy}>
                New chat
              </button>
            )}
            <button type="button" className={styles.close} onClick={handleClose} aria-label="Close Ask NOMA">
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>

        <div ref={bodyRef} className={styles.body}>
          {!hasConversation ? (
            <>
              <p className={styles.intro}>
                Ask about what you’re looking at: compare places, shape a route or plan around your dates. You stay in
                charge of every change.
              </p>
              <p className={styles.demoNote}>
                <strong>This is a demo.</strong> NOMA answers the suggested questions with prepared replies, built from
                your real trip, saved places and travel style.
              </p>
              {screen.suggestions.length > 0 && (
                <ul className={styles.suggestions} aria-label="Suggestions">
                  {screen.suggestions.map((s) => (
                    <li key={s}>
                      <button type="button" className={styles.suggestion} onClick={() => send(s)}>
                        {s}
                        <Icon name="arrow-up-right" size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <ol className={styles.messages} aria-live="polite">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <li key={m.id} className={styles.userRow}>
                    <p className={styles.userMsg}>{m.text}</p>
                  </li>
                ) : (
                  <li key={m.id} className={styles.nomaRow}>
                    <span className={styles.avatar} aria-hidden="true" />
                    {m.status === 'typing' || !m.reply ? (
                      <span className={styles.typing} aria-label="NOMA is typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      <NomaReply
                        reply={m.reply}
                        animate={m.animate}
                        isLatest={m.id === lastNomaId && !isBusy}
                        declined={Boolean(m.declined)}
                        onProgress={scrollToEnd}
                        onFollowUp={send}
                        onApply={handleApply}
                        onDecline={() => handleDecline(m.id)}
                        onNavigate={close}
                      />
                    )}
                  </li>
                ),
              )}
            </ol>
          )}
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label htmlFor={`${panelId}-input`} className="visually-hidden">
            Ask NOMA anything about your trip
          </label>
          <input
            id={`${panelId}-input`}
            ref={inputRef}
            className={styles.input}
            placeholder="Ask anything about your trip"
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className={styles.send} aria-label="Send" disabled={!draft.trim() || isBusy}>
            <Icon name="arrow-up" size={18} />
          </button>
        </form>
      </section>

      <button
        ref={triggerRef}
        type="button"
        className={cx(styles.trigger, compact && !isOpen && styles.compact, isOpen && styles.triggerHidden)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label="Ask NOMA"
        onClick={() => open()}
      >
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.triggerLabel}>Ask NOMA</span>
      </button>
    </>
  );
}
