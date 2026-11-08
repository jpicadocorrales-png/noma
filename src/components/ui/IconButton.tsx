import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';
import { cx } from '../../lib/cx';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'glass' | 'surface' | 'outline';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Accessible label — required, since there is no visible text. */
  label: string;
  variant?: IconButtonVariant;
  filled?: boolean;
  size?: 'md' | 'lg';
}

export function IconButton({
  icon,
  label,
  variant = 'outline',
  filled,
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(styles.iconButton, styles[variant], styles[size], className)}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 20 : 18} filled={filled} />
    </button>
  );
}
