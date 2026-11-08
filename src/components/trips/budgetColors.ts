import type { BudgetCategoryId } from '../../data/trips';

/** Budget categories draw only from the brand palette. */
export const BUDGET_COLORS: Record<BudgetCategoryId, string> = {
  transport: 'var(--color-forest)',
  stay: 'var(--color-sage)',
  food: 'var(--color-sand)',
  experiences: 'var(--color-terracotta)',
  other: 'rgba(37, 43, 42, 0.32)',
};
