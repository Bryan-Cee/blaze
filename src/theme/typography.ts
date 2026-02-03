import { TextStyle } from 'react-native';

// Typography styles - metric-focused with bold numerals
export const typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,

  // Metric displays (large numbers)
  metricLarge: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    letterSpacing: -1,
  } as TextStyle,

  metricMedium: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.5,
  } as TextStyle,

  metricSmall: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  } as TextStyle,

  // Labels and captions
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  } as TextStyle,

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
};

export type TypographyKeys = keyof typeof typography;
