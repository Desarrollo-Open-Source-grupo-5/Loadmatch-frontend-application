import {LoadRequest} from '../domain/model/load-request.entity';
import {LoadRequestStatus} from '../domain/model/load-request-status';

/**
 * Status filter of "My Loads": every status, or a single one.
 */
export type LoadRequestStatusFilter = 'ALL' | LoadRequestStatus;

/**
 * Filter options shown to the shipper, in display order.
 */
export const LOAD_REQUEST_STATUS_FILTERS: readonly LoadRequestStatusFilter[] = [
  'ALL',
  'PUBLISHED',
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED'
];

/**
 * Keeps the load requests that match a status filter.
 * @param loadRequests - Load requests of the shipper.
 * @param filter - Selected filter.
 * @returns The matching load requests, preserving their order.
 */
export const filterLoadRequestsByStatus = (
  loadRequests: readonly LoadRequest[],
  filter: LoadRequestStatusFilter
): LoadRequest[] =>
  filter === 'ALL' ? [...loadRequests] : loadRequests.filter(loadRequest => loadRequest.status === filter);

/**
 * Counts the load requests that match each filter option.
 * @param loadRequests - Load requests of the shipper.
 * @returns Number of load requests per filter option.
 */
export const countLoadRequestsByStatus = (
  loadRequests: readonly LoadRequest[]
): Record<LoadRequestStatusFilter, number> => {
  const counts = Object.fromEntries(
    [...LOAD_REQUEST_STATUS_FILTERS, 'DRAFT'].map(filter => [filter, 0])
  ) as Record<LoadRequestStatusFilter, number>;
  counts.ALL = loadRequests.length;
  loadRequests.forEach(loadRequest => counts[loadRequest.status]++);
  return counts;
};
