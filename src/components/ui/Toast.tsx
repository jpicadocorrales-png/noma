import { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string | null;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  /** ms before auto-dismiss */
  duration?: number;
}

/** A brief confirmation with an optional action (e.g. Undo). */
export function Toast({ message, actionLabel, onAction, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(t);
  }, [message, duration, onDismiss]);

  return (
    <div className={styles.region} aria-live="polite">
      {message && (
        <div className={styles.toast}>
          <span>{message}</span>
          {actionLabel && onAction && (
            <button type="button" className={styles.action} onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
