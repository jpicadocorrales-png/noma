import { useId } from 'react';
import { useAssistant, useAssistantScreen } from '../components/assistant/AssistantProvider';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileSection, Field } from '../components/profile/ProfileSection';
import { JourneyTimeline } from '../components/profile/JourneyTimeline';
import { ChoiceChips } from '../components/ui/ChoiceChips';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import {
  AIRPORTS,
  BUDGET_OPTIONS,
  INTEREST_OPTIONS,
  PACE_OPTIONS,
  STAY_OPTIONS,
} from '../data/profile';
import {
  resetSampleData,
  usePreferences,
  type BudgetStyle,
  type Pace,
  type Preferences,
  type Units,
} from '../state/PreferencesProvider';
import styles from './Profile.module.css';

const SUGGESTIONS = ['Suggest a trip that fits my style', 'Why do you recommend slow travel for me?', 'Plan a long weekend from my home airport'];

const NOTIFICATIONS: Array<{ id: keyof Preferences['notifications']; label: string; hint: string }> = [
  { id: 'reminders', label: 'Trip reminders', hint: 'Check-in times, tickets to print, what to pack.' },
  { id: 'planChanges', label: 'Plan changes', hint: 'Weather, delays and closures that affect your day.' },
  { id: 'priceDrops', label: 'Price drops', hint: 'When a saved stay or flight gets cheaper.' },
];

export function Profile() {
  const { preferences: p, update } = usePreferences();
  const assistant = useAssistant();
  const uid = useId();
  useAssistantScreen('Profile · Travel style', SUGGESTIONS);

  const paceHint = PACE_OPTIONS.find((o) => o.id === p.pace)?.hint;
  const budgetHint = BUDGET_OPTIONS.find((o) => o.id === p.budget)?.hint;

  return (
    <div className={`container ${styles.page}`}>
      <ProfileHeader />

      <div className={styles.layout}>
        <div className={styles.main}>
          <ProfileSection
            id="style-title"
            title="Travel style"
            description="NOMA uses this to shape suggestions and itineraries. Change it any time."
          >
            <Field label="Pace" hint={paceHint}>
              <ChoiceChips
                mode="single"
                label="Pace"
                options={PACE_OPTIONS}
                value={p.pace}
                onChange={(v) => update('pace', v as Pace)}
              />
            </Field>
            <Field label="Interests">
              <ChoiceChips
                mode="multi"
                label="Interests"
                options={INTEREST_OPTIONS}
                value={p.interests}
                onChange={(v) => update('interests', v)}
              />
            </Field>
            <Field label="Where you like to stay">
              <ChoiceChips
                mode="multi"
                label="Where you like to stay"
                options={STAY_OPTIONS}
                value={p.stays}
                onChange={(v) => update('stays', v)}
              />
            </Field>
            <Field label="Budget" hint={budgetHint}>
              <ChoiceChips
                mode="single"
                label="Budget"
                options={BUDGET_OPTIONS}
                value={p.budget}
                onChange={(v) => update('budget', v as BudgetStyle)}
              />
            </Field>
            <button
              type="button"
              className={styles.askLink}
              onClick={() => assistant.open('Suggest a trip that fits my travel style')}
            >
              <span className={styles.askMark} aria-hidden="true" />
              Suggest a trip that fits this style
              <Icon name="arrow-right" size={16} />
            </button>
          </ProfileSection>

          <ProfileSection id="settings-title" title="Settings">
            <div className={styles.settingRow}>
              <div>
                <label htmlFor={`${uid}-airport`} className={styles.settingLabel}>
                  Home airport
                </label>
                <p className={styles.settingHint}>Where trips start and end by default.</p>
              </div>
              <div className={styles.selectWrap}>
                <select
                  id={`${uid}-airport`}
                  className={styles.select}
                  value={p.homeAirport}
                  onChange={(e) => update('homeAirport', e.target.value)}
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevron-right" size={16} className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.settingRow}>
              <div>
                <p className={styles.settingLabel}>Units</p>
                <p className={styles.settingHint}>Used for temperatures and distances.</p>
              </div>
              <ChoiceChips
                mode="single"
                label="Units"
                options={[
                  { id: 'metric', label: '°C · km' },
                  { id: 'imperial', label: '°F · mi' },
                ]}
                value={p.units}
                onChange={(v) => update('units', v as Units)}
              />
            </div>

            <p className={`t-meta ${styles.groupLabel}`}>Notifications</p>
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`${styles.settingRow} ${styles.switchRow}`}>
                <div>
                  <p id={`${uid}-${n.id}`} className={styles.settingLabel}>
                    {n.label}
                  </p>
                  <p id={`${uid}-${n.id}-hint`} className={styles.settingHint}>
                    {n.hint}
                  </p>
                </div>
                <Switch
                  checked={p.notifications[n.id]}
                  labelledBy={`${uid}-${n.id}`}
                  describedBy={`${uid}-${n.id}-hint`}
                  onChange={(checked) => update('notifications', { ...p.notifications, [n.id]: checked })}
                />
              </div>
            ))}
          </ProfileSection>
        </div>

        <div className={styles.aside}>
          <ProfileSection id="journeys-title" title="Journeys so far">
            <JourneyTimeline />
          </ProfileSection>

          <section className={styles.preview} aria-labelledby="preview-title">
            <h2 id="preview-title" className={styles.previewTitle}>
              About this preview
            </h2>
            <p className={styles.previewBody}>
              NOMA is a design prototype. The traveler and trips are sample data, and anything you change is saved only
              in this browser.
            </p>
            <Button variant="secondary" size="sm" onClick={resetSampleData}>
              Reset sample data
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
