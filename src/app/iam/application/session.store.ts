import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticatedUser} from '../domain/model/authenticated-user.entity';
import {SignInCredentials} from '../domain/model/sign-in-credentials';
import {UserRole} from '../domain/model/user-role';
import {IamApi} from '../infrastructure/iam-api';

/**
 * Reason why a sign in failed.
 */
export type SignInError = 'INVALID_CREDENTIALS' | 'UNAVAILABLE';

/**
 * Serializable snapshot of the session kept in the browser storage.
 */
interface StoredSession {
  id: string;
  email: string;
  role: UserRole;
  token: string | null;
}

/**
 * Holds the session of the user authenticated by the LoadMatch Platform.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStore {
  private static readonly STORAGE_KEY = 'loadmatch.session';

  private readonly iamApi = inject(IamApi);

  private readonly currentUserSignal = signal<AuthenticatedUser | null>(SessionStore.restore());

  /**
   * Readonly signal with the authenticated user, or null when there is no session.
   */
  readonly currentUser = this.currentUserSignal.asReadonly();

  /**
   * Computed signal that is true when a user is signed in.
   */
  readonly isSignedIn = computed(() => this.currentUser() !== null);

  /**
   * Computed signal with the access token, or null without session or before JWT is enabled in the platform.
   */
  readonly token = computed(() => this.currentUser()?.token ?? null);

  private readonly signingInSignal = signal<boolean>(false);

  /**
   * Readonly signal that is true while the credentials are being verified.
   */
  readonly signingIn = this.signingInSignal.asReadonly();

  private readonly signInErrorSignal = signal<SignInError | null>(null);

  /**
   * Readonly signal with the reason of the last failed sign in.
   */
  readonly signInError = this.signInErrorSignal.asReadonly();

  /**
   * Authenticates the user and keeps the session in the browser.
   * @param credentials - Email address and password.
   * @param onSuccess - Callback invoked with the authenticated user.
   */
  signIn = (credentials: SignInCredentials, onSuccess?: (user: AuthenticatedUser) => void): void => {
    this.signingInSignal.set(true);
    this.signInErrorSignal.set(null);
    this.iamApi.signIn(credentials).subscribe({
      next: user => {
        this.currentUserSignal.set(user);
        SessionStore.persist(user);
        this.signingInSignal.set(false);
        onSuccess?.(user);
      },
      error: (error: unknown) => {
        this.signInErrorSignal.set(SessionStore.toSignInError(error));
        this.signingInSignal.set(false);
      }
    });
  };

  /**
   * Maps an HTTP error into the reason shown to the user.
   * @param error - Error raised by the sign-in request.
   * @returns INVALID_CREDENTIALS for 400/401 responses, otherwise UNAVAILABLE.
   */
  private static toSignInError(error: unknown): SignInError {
    return error instanceof HttpErrorResponse && (error.status === 400 || error.status === 401)
      ? 'INVALID_CREDENTIALS'
      : 'UNAVAILABLE';
  }

  /**
   * Reads the persisted session, tolerating unavailable or corrupted storage.
   * @returns The persisted user or null.
   */
  private static restore(): AuthenticatedUser | null {
    try {
      const stored = sessionStorage.getItem(SessionStore.STORAGE_KEY);
      return stored ? new AuthenticatedUser(JSON.parse(stored) as StoredSession) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persists the session, ignoring storage failures (private mode, blocked storage).
   * @param user - Authenticated user to persist.
   */
  private static persist(user: AuthenticatedUser): void {
    try {
      const session: StoredSession = {id: user.id, email: user.email, role: user.role, token: user.token};
      sessionStorage.setItem(SessionStore.STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Storage is optional: the session still lives in memory.
    }
  }
}
