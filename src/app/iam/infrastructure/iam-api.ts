import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AuthenticatedUser} from '../domain/model/authenticated-user.entity';
import {SignInCredentials} from '../domain/model/sign-in-credentials';
import {TokensApiEndpoint} from './tokens-api-endpoint';

/**
 * Infrastructure facade for the Identity and Access Management operations of the LoadMatch Platform.
 */
@Injectable({providedIn: 'root'})
export class IamApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly tokensEndpoint = new TokensApiEndpoint(this.http);

  /**
   * Authenticates a user with email address and password.
   * @param credentials - Credentials typed by the user.
   * @returns Stream with the authenticated user.
   */
  signIn = (credentials: SignInCredentials): Observable<AuthenticatedUser> =>
    this.tokensEndpoint.signIn(credentials);
}
