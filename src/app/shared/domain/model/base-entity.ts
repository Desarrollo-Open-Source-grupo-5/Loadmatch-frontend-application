/**
 * Minimal contract implemented by domain entities across bounded contexts.
 */
export interface BaseEntity {
  /**
   * The unique identifier for the entity.
   */
  id: number;
}
