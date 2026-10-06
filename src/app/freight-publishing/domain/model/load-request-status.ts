/**
 * Lifecycle statuses of a load request.
 */
export const LOAD_REQUEST_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED'
] as const;

/**
 * Status of a load request.
 */
export type LoadRequestStatus = (typeof LOAD_REQUEST_STATUSES)[number];
