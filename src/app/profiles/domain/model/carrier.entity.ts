import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {EnablementStatus} from './enablement-status';
import {Reputation} from './reputation';

/**
 * Independent carrier who transports loads (aggregate root `Carrier` of the Profiles context).
 */
export class Carrier implements BaseEntity {
  #id: number;
  #firstNames: string;
  #lastNames: string;
  #dni: string;
  #phoneNumber: string;
  #enablementStatus: EnablementStatus;
  #reputation: Reputation;

  /**
   * Creates a carrier.
   * @param carrier - Carrier attributes.
   */
  constructor(carrier: {
    id: number;
    firstNames: string;
    lastNames: string;
    dni: string;
    phoneNumber: string;
    enablementStatus: EnablementStatus;
    reputation: Reputation;
  }) {
    this.#id = carrier.id;
    this.#firstNames = carrier.firstNames;
    this.#lastNames = carrier.lastNames;
    this.#dni = carrier.dni;
    this.#phoneNumber = carrier.phoneNumber;
    this.#enablementStatus = carrier.enablementStatus;
    this.#reputation = carrier.reputation;
  }

  /**
   * Carrier identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * Given names.
   */
  get firstNames(): string {
    return this.#firstNames;
  }

  set firstNames(value: string) {
    this.#firstNames = value;
  }

  /**
   * Family names.
   */
  get lastNames(): string {
    return this.#lastNames;
  }

  set lastNames(value: string) {
    this.#lastNames = value;
  }

  /**
   * National identity document number (DNI, 8 digits).
   */
  get dni(): string {
    return this.#dni;
  }

  set dni(value: string) {
    this.#dni = value;
  }

  /**
   * Contact phone number.
   */
  get phoneNumber(): string {
    return this.#phoneNumber;
  }

  set phoneNumber(value: string) {
    this.#phoneNumber = value;
  }

  /**
   * Enablement status of the carrier profile.
   */
  get enablementStatus(): EnablementStatus {
    return this.#enablementStatus;
  }

  set enablementStatus(value: EnablementStatus) {
    this.#enablementStatus = value;
  }

  /**
   * Accumulated reputation given by shippers.
   */
  get reputation(): Reputation {
    return this.#reputation;
  }

  set reputation(value: Reputation) {
    this.#reputation = value;
  }

  /**
   * Full name of the carrier.
   * @returns First names followed by last names.
   */
  fullName(): string {
    return `${this.#firstNames} ${this.#lastNames}`;
  }

  /**
   * Indicates whether the carrier may accept trips.
   * @returns True when the carrier is enabled.
   */
  canAcceptTrips(): boolean {
    return this.#enablementStatus === 'ENABLED';
  }
}
