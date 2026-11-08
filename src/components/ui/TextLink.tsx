import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cx } from '../../lib/cx';
import styles from './TextLink.module.css';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  arrow?: boolean;
}

export function TextLink({ children, arrow = true, className, ...rest }: TextLinkProps) {
  return (
    <a className={cx(styles.link, className)} {...rest}>
      <span className={styles.label}>{children}</span>
      {arrow && <Icon name="arrow-right" size={16} className={styles.arrow} />}
    </a>
  );
}
