import { WelcomeSection } from '../components/explore/WelcomeSection';
import { FeaturedDestination } from '../components/explore/FeaturedDestination';
import { InterestSection } from '../components/explore/InterestSection';
import { TrendingSection } from '../components/explore/TrendingSection';
import { CollectionsSection } from '../components/explore/CollectionsSection';
import { BrandNote } from '../components/explore/BrandNote';
import { collections, featured, interests, trending } from '../data/explore';
import { useAssistantScreen } from '../components/assistant/AssistantProvider';
import styles from './ExploreHome.module.css';

const SUGGESTIONS = ['Where is good in late November?', 'Plan five slow days in Kyoto', 'Weekend trips from Lisbon'];

export function ExploreHome() {
  useAssistantScreen('Explore', SUGGESTIONS);

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
