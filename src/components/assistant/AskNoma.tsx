import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import { useAssistant } from './AssistantProvider';
import styles from './AskNoma.module.css';

/**
 * Persistent, discreet entry point to the assistant.
 * Collapses to its mark while scrolling down, so it never competes with content.
 * Context (what the traveler is looking at) comes from AssistantProvider.
 */
export function AskNoma() {
  const { screen, isOpen, open, close, draft, setDraft } = useAssistant();
  const [compact, setCompact] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

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

  useEffect(() => {
    if (!isOpen) {
      setSent(null);
      return;
    }
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    close();
    triggerRef.current?.focus();
  };

  const submit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setSent(q);
    setDraft('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  return (
    <>
      <div className={cx(styles.backdrop, isOpen && styles.backdropOpen)} onClick={handleClose} aria-hidden="true" />

      <section
        id={panelId}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={cx(styles.panel, isOpen && styles.panelOpen)}
        hidden={!isOpen}
      >
        <header className={styles.panelHeader}>
          <div>
            <h2 id={titleId} className={styles.panelTitle}>
              Ask NOMA
            </h2>
            <p className={styles.context}>
              <span className={styles.contextDot} aria-hidden="true" />
              Looking at <strong>{screen.label}</strong>
            </p>
          </div>
          <button type="button" className={styles.close} onClick={handleClose} aria-label="Close Ask NOMA">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className={styles.body}>
          {sent ? (
            <div className={styles.exchange}>
              <p className={styles.userMsg}>{sent}</p>
              <p className={styles.note}>
                The assistant isn’t connected in this preview yet. Your question will be answered here, with what
                you’re looking at as context.
              </p>
            </div>
          ) : (
            <>
              <p className={styles.intro}>
                Compare places, shape a route or plan around your dates. You stay in charge of every change.
              </p>
              {screen.suggestions.length > 0 && (
                <ul className={styles.suggestions} aria-label="Suggestions">
                  {screen.suggestions.map((s) => (
                    <li key={s}>
                      <button type="button" className={styles.suggestion} onClick={() => submit(s)}>
                        {s}
                        <Icon name="arrow-up-right" size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
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
          <button type="submit" className={styles.send} aria-label="Send" disabled={!draft.trim()}>
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
