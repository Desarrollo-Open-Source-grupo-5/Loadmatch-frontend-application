/**
 * Lifecycle statuses of a trip.
 */
export const TRIP_STATUSES = [
  'ASSIGNED',
  'EN_ROUTE_TO_PICKUP',
  'AT_PICKUP_POINT',
  'CARGO_PICKED_UP',
  'IN_TRANSIT',
  'DELAYED',
  'DELIVERED',
  'DISPUTED',
  'COMPLETED',
  'CANCELLED'
] as const;

/**
 * Status of a trip.
 */
export type TripStatus = (typeof TRIP_STATUSES)[number];

/**
 * Statuses a trip goes through when nothing unexpected happens, in order.
 */
export const NORMAL_TRIP_FLOW: readonly TripStatus[] = [
  'ASSIGNED',
  'EN_ROUTE_TO_PICKUP',
  'AT_PICKUP_POINT',
  'CARGO_PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED'
];

/**
 * Groups of the carrier's "My trips" view, in display order.
 */
export const TRIP_GROUPS = ['UPCOMING', 'IN_PROGRESS', 'COMPLETED'] as const;

/**
 * Group of a trip in "My trips": upcoming, in progress or completed.
 */
export type TripGroup = (typeof TRIP_GROUPS)[number];

/**
 * Group of each status.
 */
const TRIP_GROUP_BY_STATUS: Record<TripStatus, TripGroup | null> = {
  ASSIGNED: 'UPCOMING',
  EN_ROUTE_TO_PICKUP: 'IN_PROGRESS',
  AT_PICKUP_POINT: 'IN_PROGRESS',
  CARGO_PICKED_UP: 'IN_PROGRESS',
  IN_TRANSIT: 'IN_PROGRESS',
  DELAYED: 'IN_PROGRESS',
  DELIVERED: 'IN_PROGRESS',
  DISPUTED: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: null
};

/**
 * Finds the "My trips" group a status belongs to.
 * @param status - Trip status.
 * @returns `UPCOMING`, `IN_PROGRESS` or `COMPLETED`, or null for `CANCELLED`.
 */
export const tripGroupOf = (status: TripStatus): TripGroup | null => TRIP_GROUP_BY_STATUS[status];
