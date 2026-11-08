import { useEffect, useState } from 'react';

interface StreamedTextProps {
  text: string;
  /** Reveal word by word (false = show at once, e.g. reduced motion or history). */
  animate: boolean;
  className?: string;
  onProgress?: () => void;
  onDone?: () => void;
}

const WORDS_PER_TICK = 2;
const TICK_MS = 28;

/** Renders paragraphs, revealing them progressively like a streamed reply. */
export function StreamedText({ text, animate, className, onProgress, onDone }: StreamedTextProps) {
  const tokens = text.split(/(\s+)/);
  const [count, setCount] = useState(animate ? 0 : tokens.length);

  useEffect(() => {
    if (!animate) {
      onDone?.();
      return;
    }
    const id = window.setInterval(() => {
      setCount((c) => {
        const next = Math.min(tokens.length, c + WORDS_PER_TICK * 2);
        if (next >= tokens.length) window.clearInterval(id);
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, animate]);

  useEffect(() => {
    onProgress?.();
    if (animate && count >= tokens.length) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const visible = tokens.slice(0, count).join('');
  const paragraphs = visible.split(/\n\n/);

  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
