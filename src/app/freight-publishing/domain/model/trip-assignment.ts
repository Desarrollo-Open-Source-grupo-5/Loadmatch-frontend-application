import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Trip Execution trip: which carrier and vehicle took a load request.
 */
export class TripAssignment implements BaseEntity {
  #id: string;
  #loadRequestId: string;
  #carrierId: string;
  #vehicleId: string;
  #assignedAt: Date;

  /**
   * Creates a trip assignment.
   * @param assignment - Trip identifier, load request, carrier and vehicle references and assignment date.
   */
  constructor(assignment: { id: string; loadRequestId: string; carrierId: string; vehicleId: string; assignedAt: Date }) {
    this.#id = assignment.id;
    this.#loadRequestId = assignment.loadRequestId;
    this.#carrierId = assignment.carrierId;
    this.#vehicleId = assignment.vehicleId;
    this.#assignedAt = assignment.assignedAt;
  }

  /**
   * Trip identifier.
   */
  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  /**
   * Identifier of the load request the trip originates from.
   */
  get loadRequestId(): string {
    return this.#loadRequestId;
  }

  set loadRequestId(value: string) {
    this.#loadRequestId = value;
  }

  /**
   * Identifier of the carrier that accepted the load request (reference by id to Profiles).
   */
  get carrierId(): string {
    return this.#carrierId;
  }

  set carrierId(value: string) {
    this.#carrierId = value;
  }

  /**
   * Identifier of the vehicle assigned to the trip (reference by id to Fleet).
   */
  get vehicleId(): string {
    return this.#vehicleId;
  }

  set vehicleId(value: string) {
    this.#vehicleId = value;
  }

  /**
   * Date the carrier accepted the load request.
   */
  get assignedAt(): Date {
    return this.#assignedAt;
  }

  set assignedAt(value: Date) {
    this.#assignedAt = value;
  }
}
