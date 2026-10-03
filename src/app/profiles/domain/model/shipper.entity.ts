import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Reputation} from './reputation';

/**
 * Company that publishes load requests (aggregate root `Shipper` of the Profiles context).
 */
export class Shipper implements BaseEntity {
  #id: number;
  #ruc: string;
  #businessName: string;
  #contactName: string;
  #phoneNumber: string;
  #reputation: Reputation;

  /**
   * Creates a shipper.
   * @param shipper - Shipper attributes.
   */
  constructor(shipper: {
    id: number;
    ruc: string;
    businessName: string;
    contactName: string;
    phoneNumber: string;
    reputation: Reputation;
  }) {
    this.#id = shipper.id;
    this.#ruc = shipper.ruc;
    this.#businessName = shipper.businessName;
    this.#contactName = shipper.contactName;
    this.#phoneNumber = shipper.phoneNumber;
    this.#reputation = shipper.reputation;
  }

  /**
   * Shipper identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * Peruvian taxpayer number (RUC, 11 digits).
   */
  get ruc(): string {
    return this.#ruc;
  }

  set ruc(value: string) {
    this.#ruc = value;
  }

  /**
   * Registered business name.
   */
  get businessName(): string {
    return this.#businessName;
  }

  set businessName(value: string) {
    this.#businessName = value;
  }

  /**
   * Name of the contact person.
   */
  get contactName(): string {
    return this.#contactName;
  }

  set contactName(value: string) {
    this.#contactName = value;
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
   * Accumulated reputation given by carriers.
   */
  get reputation(): Reputation {
    return this.#reputation;
  }

  set reputation(value: Reputation) {
    this.#reputation = value;
  }
}
