/**
 * Role of a LoadMatch account, as returned by the platform (`ROLE_SHIPPER` / `ROLE_CARRIER`) without its prefix.
 */
export type UserRole = 'SHIPPER' | 'CARRIER';

/**
 * Converts a platform role name into a user role.
 * @param roleName - Role name returned by the platform (e.g. `ROLE_SHIPPER`).
 * @returns The user role.
 */
export const toUserRole = (roleName: string): UserRole =>
  roleName.replace(/^ROLE_/, '') === 'CARRIER' ? 'CARRIER' : 'SHIPPER';
