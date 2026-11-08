import type { Interest } from '../../data/explore';
import { SectionHeader } from '../ui/SectionHeader';
import { InterestCard } from './InterestCard';
import rail from '../ui/rail.module.css';
import styles from './InterestSection.module.css';

interface InterestSectionProps {
  interests: Interest[];
}

export function InterestSection({ interests }: InterestSectionProps) {
  return (
    <section aria-labelledby="interests-title">
      <SectionHeader id="interests-title" title="Explore by interest" />
      <ul className={`${rail.rail} ${styles.grid}`}>
        {interests.map((interest) => (
          <li key={interest.id}>
            <InterestCard interest={interest} />
          </li>
        ))}
      </ul>
    </section>
  );
}
