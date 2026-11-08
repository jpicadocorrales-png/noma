import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { Icon, type IconName } from './Icon';
import { cx } from '../../lib/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'accent';
export type ButtonSize = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconRight?: IconName;
  iconLeft?: IconName;
  children: ReactNode;
}

interface ButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconRight?: IconName;
  className?: string;
  children: ReactNode;
}

/** A router link that looks like a Button (for navigation, not actions). */
export function ButtonLink({ to, variant = 'primary', size = 'md', iconRight, className, children }: ButtonLinkProps) {
  return (
    <Link to={to} className={cx(styles.button, styles[variant], styles[size], className)}>
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={18} className={styles.iconRight} />}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], styles[size], className)}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={18} className={styles.iconLeft} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={18} className={styles.iconRight} />}
    </button>
  );
}
