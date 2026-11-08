/**
 * Sign-in request sent to the `/tokens` endpoint of the LoadMatch Platform.
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Authenticated user returned by the `/tokens` endpoint of the LoadMatch Platform.
 */
export interface AuthenticatedUserResource {
  id: string;
  email: string;
  /**
   * Role name with its prefix (e.g. `ROLE_SHIPPER`).
   */
  role: string;
  /**
   * JWT access token; absent until the platform enables JWT authentication.
   */
  token?: string | null;
}
