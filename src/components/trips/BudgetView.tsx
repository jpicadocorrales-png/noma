import type { Trip } from '../../data/trips';
import { ProgressBar } from '../ui/ProgressBar';
import { budgetSummary } from '../../state/TripsProvider';
import { formatMoney } from '../../lib/money';
import { BUDGET_COLORS } from './budgetColors';
import styles from './BudgetView.module.css';

export function BudgetView({ trip }: { trip: Trip }) {
  const summary = budgetSummary(trip);
  if (!summary || !trip.budget) return <p className={styles.empty}>No budget set for this trip yet.</p>;

  const perDay = Math.round(summary.remaining / Math.max(1, trip.days.length));
  const categoryLabel = new Map(trip.budget.categories.map((c) => [c.id, c.label]));
  const lines = [
    ...trip.bookings.filter((b) => b.amount > 0).map((b) => ({ id: b.id, label: b.title, sub: b.provider, amount: b.amount, dayIndex: b.dayIndex, categoryId: b.categoryId })),
    ...trip.budget.expenses.map((e) => ({ id: e.id, label: e.label, sub: 'Added manually', amount: e.amount, dayIndex: e.dayIndex, categoryId: e.categoryId })),
  ].sort((a, b) => a.dayIndex - b.dayIndex || b.amount - a.amount);

  return (
    <div className={styles.view}>
      <section className={styles.overview} aria-label="Budget overview">
        <p className={`t-meta ${styles.overviewLabel}`}>Committed so far</p>
        <p className={styles.total}>{formatMoney(summary.committed)}</p>
        <p className={styles.planned}>of {formatMoney(summary.planned)} planned</p>

        <div
          className={styles.stack}
          role="img"
          aria-label={summary.categories.map((c) => `${c.label} ${formatMoney(c.committed)}`).join(', ')}
        >
          {summary.categories.map((c) =>
            c.committed > 0 ? (
              <span
                key={c.id}
                className={styles.segment}
                style={{ width: `${(c.committed / summary.planned) * 100}%`, background: BUDGET_COLORS[c.id] }}
              />
            ) : null,
          )}
        </div>

        <ul className={styles.legend}>
          {summary.categories.map((c) => (
            <li key={c.id}>
              <span className={styles.swatch} style={{ background: BUDGET_COLORS[c.id] }} aria-hidden="true" />
              {c.label}
            </li>
          ))}
        </ul>

        <dl className={styles.facts}>
          <div>
            <dt className="t-meta">Remaining</dt>
            <dd>{formatMoney(summary.remaining)}</dd>
          </div>
          <div>
            <dt className="t-meta">Left per day</dt>
            <dd>≈ {formatMoney(perDay)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="budget-categories" className={styles.block}>
        <h2 id="budget-categories" className={styles.blockTitle}>
          By category
        </h2>
        <ul className={styles.categories}>
          {summary.categories.map((c) => {
            const ratio = c.planned ? c.committed / c.planned : 0;
            return (
              <li key={c.id} className={styles.category}>
                <div className={styles.categoryHead}>
                  <span className={styles.categoryName}>
                    <span className={styles.swatch} style={{ background: BUDGET_COLORS[c.id] }} aria-hidden="true" />
                    {c.label}
                  </span>
                  <span className={styles.categoryFigures}>
                    {formatMoney(c.committed)} <span>/ {formatMoney(c.planned)}</span>
                  </span>
                </div>
                <ProgressBar
                  value={c.committed}
                  max={c.planned}
                  label={`${c.label} budget used`}
                  tone={ratio > 1 ? 'warning' : 'forest'}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="budget-lines" className={styles.block}>
        <h2 id="budget-lines" className={styles.blockTitle}>
          Spending
        </h2>
        <ul className={styles.lines}>
          {lines.map((l) => (
            <li key={l.id} className={styles.line}>
              <span className={styles.swatch} style={{ background: BUDGET_COLORS[l.categoryId] }} aria-hidden="true" />
              <div className={styles.lineText}>
                <p className={styles.lineLabel}>{l.label}</p>
                <p className={styles.lineSub}>
                  Day {String(l.dayIndex + 1).padStart(2, '0')} · {categoryLabel.get(l.categoryId)} · {l.sub}
                </p>
              </div>
              <span className={styles.lineAmount}>{formatMoney(l.amount)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
