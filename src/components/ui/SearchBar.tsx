import { useId, useState, type FormEvent } from 'react';
import { Icon } from './Icon';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ placeholder = 'Search a city or country', onSearch }: SearchBarProps) {
  const id = useId();
  const [query, setQuery] = useState('');

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
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.submit} aria-label="Search" disabled={!query.trim()}>
        <Icon name="arrow-right" size={18} />
      </button>
    </form>
  );
}
