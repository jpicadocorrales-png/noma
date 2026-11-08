import { useState } from 'react';
import { IconButton, type IconButtonVariant } from './IconButton';

interface SaveButtonProps {
  placeName: string;
  variant?: IconButtonVariant;
  className?: string;
  defaultSaved?: boolean;
}

/** Bookmark toggle. Local state for now — wired to "Saved" later. */
export function SaveButton({ placeName, variant = 'surface', className, defaultSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(defaultSaved);

  return (
    <IconButton
      icon="bookmark"
      variant={variant}
      filled={saved}
      aria-pressed={saved}
      label={saved ? `Remove ${placeName} from saved` : `Save ${placeName}`}
      onClick={() => setSaved((s) => !s)}
      className={className}
    />
  );
}
