// Strava-inspired color palette for Blaze
export const colors = {
  // Backgrounds
  background: '#111418',
  backgroundSecondary: '#1a1e24',
  backgroundTertiary: '#242930',
  card: '#1a1e24',

  // Primary accent (Strava orange)
  primary: '#f15c22',
  primaryDark: '#d14d1a',
  primaryLight: '#ff7a47',

  // Secondary accent (teal/blue)
  secondary: '#1f8ac0',
  secondaryDark: '#1a739f',
  secondaryLight: '#3aa0d6',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B4BDC9',
  textTertiary: '#6b7280',
  textMuted: '#4b5563',

  // Status colors
  success: '#2ecc71',
  successDark: '#27ae60',
  warning: '#f1c40f',
  warningDark: '#d4ac0d',
  error: '#e74c3c',
  errorDark: '#c0392b',
  info: '#3498db',

  // UI elements
  border: '#2d3139',
  divider: '#2d3139',
  inputBackground: '#1a1e24',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Specific use
  water: '#3498db',
  protein: '#e74c3c',
  carbs: '#f1c40f',
  fat: '#9b59b6',
};

export type ColorKeys = keyof typeof colors;
