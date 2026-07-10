/**
 * Offside AI — Tactical Dark Theme
 * Inspired by EA FC, Opta, and tactical analysis software.
 * Matte black background, neon green accent, electric blue highlights.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const OffsideColors = {
  // Core backgrounds
  background: '#0B0F14',
  card: '#161B22',
  cardElevated: '#1C2333',
  cardBorder: '#21262D',
  surface: '#0D1117',

  // Primary accent
  primaryGreen: '#00FF87',
  primaryGreenDim: 'rgba(0, 255, 135, 0.15)',
  primaryGreenGlow: 'rgba(0, 255, 135, 0.3)',

  // Secondary
  secondaryBlue: '#3B82F6',
  secondaryBlueDim: 'rgba(59, 130, 246, 0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8B949E',
  textTertiary: '#484F58',

  // Status
  live: '#FF4757',
  liveDim: 'rgba(255, 71, 87, 0.2)',
  warning: '#FFD93D',
  warningDim: 'rgba(255, 217, 61, 0.15)',
  success: '#00FF87',

  // Pitch
  pitchDark: '#1A472A',
  pitchLight: '#1E5631',
  pitchLine: 'rgba(255, 255, 255, 0.3)',

  // Gradients
  gradientStart: '#0B0F14',
  gradientEnd: '#161B22',

  // Tab bar
  tabBarBackground: '#0B0F14',
  tabBarBorder: '#21262D',
  tabActive: '#00FF87',
  tabInactive: '#8B949E',

  // Heatmap colors
  heatLow: 'rgba(0, 255, 135, 0.2)',
  heatMedium: 'rgba(255, 217, 61, 0.5)',
  heatHigh: 'rgba(255, 71, 87, 0.8)',
} as const;

// Keep the old Colors for backward compat during migration
export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#0B0F14',
    backgroundElement: '#161B22',
    backgroundSelected: '#1C2333',
    textSecondary: '#8B949E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0B0F14',
    backgroundElement: '#161B22',
    backgroundSelected: '#1C2333',
    textSecondary: '#8B949E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardElevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#00FF87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  liveGlow: {
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
