import { Link, useLocation, useNavigate } from 'react-router';
import { Icon } from './Icon';
import styles from './BackLink.module.css';

interface BackLinkProps {
  /** Where to go when there's no in-app history (e.g. opened from a shared link). */
  fallback: string;
  label: string;
}

/** Goes back in history when possible, otherwise to a sensible parent page. */
export function BackLink({ fallback, label }: BackLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasHistory = location.key !== 'default';

  const content = (
    <>
      <Icon name="arrow-left" size={18} />
      {label}
    </>
  );

  return hasHistory ? (
    <button type="button" className={styles.back} onClick={() => navigate(-1)}>
      {content}
    </button>
  ) : (
    <Link to={fallback} className={styles.back}>
      {content}
    </Link>
  );
}
