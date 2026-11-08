import { useEffect, useId, useState, type FormEvent } from 'react';
import { Icon } from './Icon';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  /** Initial/external value, e.g. from the URL. */
  value?: string;
  /** Called on submit. */
  onSearch?: (query: string) => void;
  /** Called on every keystroke (for live filtering). */
  onChange?: (query: string) => void;
}

export function SearchBar({ placeholder = 'Search a city or country', value = '', onSearch, onChange }: SearchBarProps) {
  const id = useId();
  const [query, setQuery] = useState(value);

  // Follow external changes (e.g. back/forward navigation).
  useEffect(() => setQuery(value), [value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) onSearch?.(q);
  };

  return (
    <form role="search" className={styles.search} onSubmit={handleSubmit}>
      <label htmlFor={id} className="visually-hidden">
        Search destinations
      </label>
      <Icon name="search" size={20} className={styles.leading} />
      <input
        id={id}
        type="search"
        className={styles.input}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
        }}
      />
      <button type="submit" className={styles.submit} aria-label="Search" disabled={!query.trim()}>
        <Icon name="arrow-right" size={18} />
      </button>
    </form>
  );
}
