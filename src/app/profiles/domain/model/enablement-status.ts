/**
 * Enablement statuses of a carrier.
 */
export const ENABLEMENT_STATUSES = ['PENDING', 'ENABLED', 'SUSPENDED'] as const;

/**
 * Enablement status of a carrier: pending document validation, enabled to accept trips, or suspended.
 */
export type EnablementStatus = (typeof ENABLEMENT_STATUSES)[number];
