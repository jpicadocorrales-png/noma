import type { Destination } from '../../data/explore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextLink } from '../ui/TextLink';
import { RailControls } from '../ui/RailControls';
import { useRail } from '../ui/useRail';
import { DestinationCard } from './DestinationCard';
import rail from '../ui/rail.module.css';
import styles from './TrendingSection.module.css';

interface TrendingSectionProps {
  destinations: Destination[];
}

export function TrendingSection({ destinations }: TrendingSectionProps) {
  const { ref, canPrev, canNext, scroll } = useRail<HTMLUListElement>();

  return (
    <section aria-labelledby="trending-title">
      <SectionHeader
        id="trending-title"
        title="Trending destinations"
        actions={
          <div className={styles.actions}>
            <TextLink href="#trending">See all</TextLink>
            <RailControls label="destinations" canPrev={canPrev} canNext={canNext} onScroll={scroll} />
          </div>
        }
      />
      <ul ref={ref} className={rail.rail}>
        {destinations.map((d, i) => (
          <li key={d.id}>
            <DestinationCard destination={d} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
