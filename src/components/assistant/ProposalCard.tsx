import { useMemo } from 'react';
import { Link } from 'react-router';
import { getPlanChange, changeBudgetDelta } from '../../data/planChanges';
import { createSampleTrips } from '../../data/trips';
import { dayDate, useTrips } from '../../state/TripsProvider';
import { formatFullDay } from '../../lib/dates';
import { formatMoney } from '../../lib/money';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { cx } from '../../lib/cx';
import styles from './ProposalCard.module.css';

interface ProposalCardProps {
  changeId: string;
  declined: boolean;
  onApply: () => void;
  onDecline: () => void;
  onNavigate: () => void;
}

/** Shows exactly what a plan change would do, and lets the traveler decide. */
export function ProposalCard({ changeId, declined, onApply, onDecline, onNavigate }: ProposalCardProps) {
  const { today, isApplied } = useTrips();
  const change = getPlanChange(changeId);
  // Compare against the original plan, so the card reads the same before and after applying.
  const original = useMemo(() => createSampleTrips(today).find((t) => t.id === change?.tripId), [today, change]);
  if (!change || !original) return null;

  const applied = isApplied(change.id);
  const day = original.days[change.dayIndex];
  const date = dayDate(original, change.dayIndex);
  const removed = day.items.filter((a) => change.removeActivities.includes(a.id));
  const cancelled = original.bookings.filter((b) => change.removeBookings.includes(b.id));
  const delta = changeBudgetDelta(change, original);
  const dayLabel = `Day ${String(change.dayIndex + 1).padStart(2, '0')}`;

  return (
    <div className={cx(styles.card, applied && styles.applied)}>
      <p className={`t-meta ${styles.meta}`}>
        Proposed change · {dayLabel}
        {date && ` · ${formatFullDay(date)}`}
      </p>
      <p className={styles.title}>{change.title}</p>

      <ul className={styles.diff} aria-label="Changes to the itinerary">
        {removed.map((a) => (
          <li key={a.id} className={styles.removed}>
            <span className={styles.sign} aria-label="Removed">
              −
            </span>
            <span className={styles.time}>{a.time}</span>
            <span className={styles.what}>{a.title}</span>
          </li>
        ))}
        {change.addActivities.map((a) => (
          <li key={a.id} className={styles.added}>
            <span className={styles.sign} aria-label="Added">
              +
            </span>
            <span className={styles.time}>{a.time}</span>
            <span className={styles.what}>{a.title}</span>
          </li>
        ))}
      </ul>

      <dl className={styles.effects}>
        {cancelled.map((b) => (
          <div key={b.id}>
            <dt>Booking</dt>
            <dd>
              {b.title} ({b.reference}) cancelled, {formatMoney(b.amount)} refunded
            </dd>
          </div>
        ))}
        <div>
          <dt>Budget</dt>
          <dd>
            {formatMoney(delta.added)} new spending · net {delta.net < 0 ? '−' : '+'}
            {formatMoney(Math.abs(delta.net))}
          </dd>
        </div>
      </dl>

      {applied ? (
        <div className={styles.status}>
          <span className={styles.statusIcon} aria-hidden="true">
            <Icon name="check" size={14} strokeWidth={2.2} />
          </span>
          <span>Applied to {dayLabel}</span>
          <Link to={`/trips/${change.tripId}?day=${change.dayIndex + 1}`} className={styles.view} onClick={onNavigate}>
            View {dayLabel}
          </Link>
        </div>
      ) : declined ? (
        <p className={styles.statusMuted}>You kept your original plan.</p>
      ) : (
        <div className={styles.actions}>
          <Button size="sm" onClick={onApply}>
            Apply changes
          </Button>
          <Button size="sm" variant="secondary" onClick={onDecline}>
            Not now
          </Button>
        </div>
      )}
    </div>
  );
}
