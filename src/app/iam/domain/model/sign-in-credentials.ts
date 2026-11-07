/**
 * Credentials typed by a user on the sign-in view.
 */
export class SignInCredentials {
  readonly #email: string;
  readonly #password: string;

  /**
   * Creates the credentials.
   * @param credentials - Email address and password.
   */
  constructor(credentials: { email: string; password: string }) {
    this.#email = credentials.email.trim().toLowerCase();
    this.#password = credentials.password;
  }

  /**
   * Email address used to sign in.
   */
  get email(): string {
    return this.#email;
  }

  /**
   * Raw password; it is only sent to the platform and never stored.
   */
  get password(): string {
    return this.#password;
  }
}
