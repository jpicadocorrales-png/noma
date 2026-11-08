import { WelcomeSection } from '../components/explore/WelcomeSection';
import { FeaturedDestination } from '../components/explore/FeaturedDestination';
import { InterestSection } from '../components/explore/InterestSection';
import { TrendingSection } from '../components/explore/TrendingSection';
import { CollectionsSection } from '../components/explore/CollectionsSection';
import { BrandNote } from '../components/explore/BrandNote';
import { collections, featured, interests, trending } from '../data/explore';
import styles from './ExploreHome.module.css';

export function ExploreHome() {
  return (
    <div className={`container ${styles.page}`}>
      <WelcomeSection />
      <FeaturedDestination destination={featured} />
      <InterestSection interests={interests} />
      <TrendingSection destinations={trending} />
      <CollectionsSection collections={collections} />
      <BrandNote />
    </div>
  );
}
