import { IconButton } from './IconButton';
import styles from './RailControls.module.css';

interface RailControlsProps {
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onScroll: (direction: 1 | -1) => void;
}

/** Previous/next buttons — shown only where a pointer is likely (tablet+). */
export function RailControls({ label, canPrev, canNext, onScroll }: RailControlsProps) {
  return (
    <div className={styles.controls}>
      <IconButton icon="chevron-left" label={`Previous ${label}`} disabled={!canPrev} onClick={() => onScroll(-1)} />
      <IconButton icon="chevron-right" label={`Next ${label}`} disabled={!canNext} onClick={() => onScroll(1)} />
    </div>
  );
}
