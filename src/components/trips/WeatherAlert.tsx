import type { WeatherAlert as Alert } from '../../data/trips';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import styles from './WeatherAlert.module.css';

interface WeatherAlertProps {
  alert: Alert;
  onAdapt: () => void;
  onDismiss: () => void;
}

/** A change in circumstances, with NOMA offering (not forcing) a new plan. */
export function WeatherAlert({ alert, onAdapt, onDismiss }: WeatherAlertProps) {
  return (
    <aside className={styles.alert} aria-label="Plan change suggestion">
      <div className={styles.icon} aria-hidden="true">
        <Icon name="rain" size={20} />
      </div>
      <div className={styles.text}>
        <p className={styles.title}>{alert.title}</p>
        <p className={styles.body}>{alert.body}</p>
        <div className={styles.actions}>
          <Button size="sm" variant="primary" onClick={onAdapt}>
            Adapt with NOMA
          </Button>
          <Button size="sm" variant="secondary" onClick={onDismiss}>
            Keep my plan
          </Button>
        </div>
      </div>
    </aside>
  );
}
