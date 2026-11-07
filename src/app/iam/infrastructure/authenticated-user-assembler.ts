import {AuthenticatedUser} from '../domain/model/authenticated-user.entity';
import {SignInCredentials} from '../domain/model/sign-in-credentials';
import {toUserRole} from '../domain/model/user-role';
import {AuthenticatedUserResource, SignInRequest} from './authenticated-user-response';

/**
 * Maps the sign-in request and the authenticated user between the domain and the API resources.
 */
export class AuthenticatedUserAssembler {

  /**
   * Converts an authenticated user resource into a domain entity.
   * @param resource - Resource returned by the platform.
   * @returns The authenticated user.
   */
  toEntityFromResource = (resource: AuthenticatedUserResource): AuthenticatedUser =>
    new AuthenticatedUser({
      id: resource.id,
      email: resource.email,
      role: toUserRole(resource.role),
      token: resource.token ?? null
    });

  /**
   * Converts the credentials into the sign-in request body.
   * @param credentials - Credentials typed by the user.
   * @returns The sign-in request.
   */
  toRequestFromCredentials = (credentials: SignInCredentials): SignInRequest =>
    ({email: credentials.email, password: credentials.password});
}
