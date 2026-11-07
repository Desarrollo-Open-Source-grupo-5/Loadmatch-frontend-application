/**
 * Minimal reference to the shipper or carrier profile that belongs to a signed-in user.
 */
export interface ProfileReference {
  /**
   * Identifier of the Shipper or Carrier in the LoadMatch Platform.
   */
  profileId: string;
  /**
   * Name shown in the toolbar (business name or carrier full name).
   */
  displayName: string;
}
