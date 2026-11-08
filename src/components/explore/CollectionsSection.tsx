import type { Collection } from '../../data/explore';
import { SectionHeader } from '../ui/SectionHeader';
import { CollectionCard } from './CollectionCard';
import styles from './CollectionsSection.module.css';

interface CollectionsSectionProps {
  collections: Collection[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  return (
    <section aria-labelledby="collections-title">
      <SectionHeader
        id="collections-title"
        tone="editorial"
        eyebrow="Curated by NOMA"
        title="Stories worth slowing down for"
        description="Routes our editors have walked, eaten and slept their way through, ready to shape into your own trip."
      />
      <ul className={styles.grid}>
        {collections.map((c, i) => (
          <li key={c.id} className={i === 0 ? styles.leadItem : undefined}>
            <CollectionCard collection={c} index={i} layout={i === 0 ? 'lead' : 'side'} />
          </li>
        ))}
      </ul>
    </section>
  );
}
