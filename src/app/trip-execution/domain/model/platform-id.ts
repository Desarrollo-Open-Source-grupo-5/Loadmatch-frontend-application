/**
 * Platform resources use UUIDs. The demo provider still uses numeric identifiers.
 */
export const isPlatformId = (id: string): boolean =>
  /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id);
