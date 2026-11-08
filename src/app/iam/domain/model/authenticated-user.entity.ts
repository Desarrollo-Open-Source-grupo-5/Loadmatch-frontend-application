import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {UserRole} from './user-role';

/**
 * User authenticated by the LoadMatch Platform.
 */
export class AuthenticatedUser implements BaseEntity {
  #id: string;
  readonly #email: string;
  readonly #role: UserRole;
  readonly #token: string | null;

  /**
   * Creates an authenticated user.
   * @param user - Identifier, email address, role and the access token (null until JWT is available).
   */
  constructor(user: { id: string; email: string; role: UserRole; token: string | null }) {
    this.#id = user.id;
    this.#email = user.email;
    this.#role = user.role;
    this.#token = user.token;
  }

  /**
   * Identifier of the IAM user.
   */
  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  /**
   * Email address of the account.
   */
  get email(): string {
    return this.#email;
  }

  /**
   * Role of the account.
   */
  get role(): UserRole {
    return this.#role;
  }

  /**
   * Access token sent in the Authorization header, or null when the platform does not issue tokens yet.
   */
  get token(): string | null {
    return this.#token;
  }

  /**
   * @returns True when the account belongs to a shipper.
   */
  isShipper(): boolean {
    return this.#role === 'SHIPPER';
  }

  /**
   * @returns True when the account belongs to a carrier.
   */
  isCarrier(): boolean {
    return this.#role === 'CARRIER';
  }
}
