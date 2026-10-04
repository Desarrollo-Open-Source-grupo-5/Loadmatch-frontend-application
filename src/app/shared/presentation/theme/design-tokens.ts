/**
 * Hex values of the LoadMatch Design System.
 */
export const DESIGN_TOKENS = {
  primaryOrange: '#FE6B00',
  orangePressed: '#A04100',
  darkNavy: '#0B1C30',
  sidebarDark: '#131B2E',
  white: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  blueTint: '#EFF4FF',
  success: '#059669',
  successText: '#047857',
  error: '#DC2626',
  errorText: '#B91C1C',
  warning: '#F59E0B',
  warningText: '#B45309',
  info: '#3B82F6',
  infoText: '#1D4ED8',
  slate900: '#0F172A',
  slate700: '#334155',
  slate600: '#475569',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  publishedSurface: '#FFEDE6',
  assignedSurface: '#FFFBEB',
  deliveredSurface: '#ECFDF5',
  cancelledSurface: '#FEF2F2'
} as const;

/**
 * Text color drawn over a background color somewhere in the interface.
 */
export interface TextColorPair {
  /**
   * Where the pair is used.
   */
  usage: string;
  /**
   * Text color (hex).
   */
  foreground: string;
  /**
   * Background color (hex).
   */
  background: string;
}

/**
 * Every text/background pair used by the interface.
 */
export const TEXT_COLOR_PAIRS: readonly TextColorPair[] = [
  {usage: 'Filled primary button', foreground: DESIGN_TOKENS.darkNavy, background: DESIGN_TOKENS.primaryOrange},
  {usage: 'Toolbar text', foreground: DESIGN_TOKENS.white, background: DESIGN_TOKENS.darkNavy},
  {usage: 'Toolbar brand accent', foreground: DESIGN_TOKENS.primaryOrange, background: DESIGN_TOKENS.darkNavy},
  {usage: 'Side navigation text', foreground: DESIGN_TOKENS.white, background: DESIGN_TOKENS.sidebarDark},
  {usage: 'Side navigation section label', foreground: DESIGN_TOKENS.slate300, background: DESIGN_TOKENS.sidebarDark},
  {usage: 'Active navigation entry', foreground: DESIGN_TOKENS.darkNavy, background: DESIGN_TOKENS.primaryOrange},
  {usage: 'Titles', foreground: DESIGN_TOKENS.slate900, background: DESIGN_TOKENS.backgroundLight},
  {usage: 'Body text', foreground: DESIGN_TOKENS.slate700, background: DESIGN_TOKENS.backgroundLight},
  {usage: 'Secondary text on cards', foreground: DESIGN_TOKENS.slate600, background: DESIGN_TOKENS.white},
  {usage: 'Secondary text on Blue Tint', foreground: DESIGN_TOKENS.slate600, background: DESIGN_TOKENS.blueTint},
  {usage: 'Links and text buttons', foreground: DESIGN_TOKENS.orangePressed, background: DESIGN_TOKENS.white},
  {usage: 'Urgent badge', foreground: DESIGN_TOKENS.white, background: DESIGN_TOKENS.orangePressed},
  {usage: 'Destructive filled button', foreground: DESIGN_TOKENS.white, background: DESIGN_TOKENS.error},
  {usage: 'Destructive text button', foreground: DESIGN_TOKENS.error, background: DESIGN_TOKENS.white},
  {usage: 'Info notice', foreground: DESIGN_TOKENS.infoText, background: DESIGN_TOKENS.blueTint},
  {usage: 'Status: Draft', foreground: DESIGN_TOKENS.slate700, background: DESIGN_TOKENS.slate200},
  {usage: 'Status: Searching for vehicle', foreground: DESIGN_TOKENS.orangePressed, background: DESIGN_TOKENS.publishedSurface},
  {usage: 'Status: Assigned', foreground: DESIGN_TOKENS.warningText, background: DESIGN_TOKENS.assignedSurface},
  {usage: 'Status: In transit', foreground: DESIGN_TOKENS.infoText, background: DESIGN_TOKENS.blueTint},
  {usage: 'Status: Delivered', foreground: DESIGN_TOKENS.successText, background: DESIGN_TOKENS.deliveredSurface},
  {usage: 'Status: Cancelled and error banners', foreground: DESIGN_TOKENS.errorText, background: DESIGN_TOKENS.cancelledSurface}
];

/**
 * Computes the relative luminance of a color as defined by WCAG 2.1.
 * @param hex - Color in `#RRGGBB` format.
 * @returns Relative luminance between 0 (black) and 1 (white).
 */
export const relativeLuminance = (hex: string): number => {
  const channels = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [red, green, blue] = channels.map(channel =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

/**
 * Computes the WCAG 2.1 contrast ratio between two colors (order does not matter).
 * @param foreground - Text color in `#RRGGBB` format.
 * @param background - Background color in `#RRGGBB` format.
 * @returns Contrast ratio between 1 and 21.
 */
export const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};
