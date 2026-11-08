import type { ReactNode } from 'react';
import styles from './ProfileSection.module.css';

interface ProfileSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ProfileSection({ id, title, description, children }: ProfileSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <header className={styles.header}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      {children}
    </section>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

/** A labelled group inside a section. */
export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <p className={`t-meta ${styles.fieldLabel}`}>{label}</p>
      {children}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
