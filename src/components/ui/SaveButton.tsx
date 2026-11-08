import { IconButton, type IconButtonVariant } from './IconButton';
import { useSaved } from '../../state/SavedProvider';

interface SaveButtonProps {
  itemId: string;
  placeName: string;
  variant?: IconButtonVariant;
  className?: string;
  /** Called after toggling, with the new saved state. */
  onToggle?: (saved: boolean) => void;
}

/** Bookmark toggle backed by the shared Saved store. */
export function SaveButton({ itemId, placeName, variant = 'surface', className, onToggle }: SaveButtonProps) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(itemId);

  return (
    <IconButton
      icon="bookmark"
      variant={variant}
      filled={saved}
      aria-pressed={saved}
      label={saved ? `Remove ${placeName} from saved` : `Save ${placeName}`}
      onClick={() => {
        toggle(itemId);
        onToggle?.(!saved);
      }}
      className={className}
    />
  );
}
