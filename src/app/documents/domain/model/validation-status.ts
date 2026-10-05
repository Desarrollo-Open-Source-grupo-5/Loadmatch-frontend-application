/**
 * Validation statuses of a carrier document.
 */
export const VALIDATION_STATUSES = ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'] as const;

/**
 * Validation status of a document.
 */
export type ValidationStatus = (typeof VALIDATION_STATUSES)[number];

/**
 * Status shown for a mandatory document type: the validation status of the carrier's document or `NOT_UPLOADED` when
 * the carrier has no document of that type yet.
 */
export type DocumentDisplayStatus = ValidationStatus | 'NOT_UPLOADED';
