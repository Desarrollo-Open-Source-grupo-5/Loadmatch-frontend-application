/**
 * Orderings available for the available loads search.
 */
export const SORT_CRITERIA = ['MOST_RECENT', 'HIGHEST_RATE', 'SHORTEST_DISTANCE'] as const;

/**
 * Ordering applied to the search results: most recently published, highest offered rate or shortest distance to the
 * carrier.
 */
export type SortCriteria = (typeof SORT_CRITERIA)[number];
