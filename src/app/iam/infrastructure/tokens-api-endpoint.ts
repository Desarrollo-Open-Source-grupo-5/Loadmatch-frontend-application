import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticatedUser} from '../domain/model/authenticated-user.entity';
import {SignInCredentials} from '../domain/model/sign-in-credentials';
import {AuthenticatedUserResource} from './authenticated-user-response';
import {AuthenticatedUserAssembler} from './authenticated-user-assembler';

/**
 * Endpoint client for the sign-in operation of the LoadMatch Platform (`POST /tokens`).
 */
export class TokensApiEndpoint {
  private readonly endpointUrl = `${environment.platformApiBaseUrl}${environment.platformTokensEndpointPath}`;
  private readonly assembler = new AuthenticatedUserAssembler();

  /**
   * Creates an instance of TokensApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Authenticates the user. HTTP errors are propagated so the caller can tell invalid credentials (400) from an
   * unavailable platform.
   * @param credentials - Email address and password.
   * @returns Stream with the authenticated user.
   */
  signIn(credentials: SignInCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUserResource>(this.endpointUrl, this.assembler.toRequestFromCredentials(credentials))
      .pipe(map(resource => this.assembler.toEntityFromResource(resource)));
  }
}
