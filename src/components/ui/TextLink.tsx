import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Icon } from './Icon';
import { cx } from '../../lib/cx';
import styles from './TextLink.module.css';

interface TextLinkProps {
  to: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

export function TextLink({ to, children, arrow = true, className }: TextLinkProps) {
  return (
    <Link to={to} className={cx(styles.link, className)}>
      <span className={styles.label}>{children}</span>
      {arrow && <Icon name="arrow-right" size={16} className={styles.arrow} />}
    </Link>
  );
}
