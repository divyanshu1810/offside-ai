/**
 * Typography System — Offside AI
 * Sora for headers (sporty, modern), Inter for body (readable).
 */

import { TextStyle, Platform } from 'react-native';
import { OffsideColors } from './theme';

// Font family names as loaded by expo-font
export const FontFamily = {
  soraRegular: 'Sora_400Regular',
  soraMedium: 'Sora_500Medium',
  soraSemiBold: 'Sora_600SemiBold',
  soraBold: 'Sora_700Bold',
  soraExtraBold: 'Sora_800ExtraBold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
} as const;

// Fallback fonts before custom fonts load
const fallbackSans = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography: Record<string, TextStyle> = {
  // ─── Headers (Sora) ─────────────────────────────
  heroTitle: {
    fontFamily: FontFamily.soraExtraBold,
    fontSize: 32,
    lineHeight: 40,
    color: OffsideColors.textPrimary,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: 24,
    lineHeight: 32,
    color: OffsideColors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: OffsideColors.textPrimary,
  },
  cardTitle: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: OffsideColors.textPrimary,
  },

  // ─── Body (Inter) ──────────────────────────────
  bodyLarge: {
    fontFamily: FontFamily.interRegular,
    fontSize: 16,
    lineHeight: 24,
    color: OffsideColors.textPrimary,
  },
  body: {
    fontFamily: FontFamily.interRegular,
    fontSize: 14,
    lineHeight: 20,
    color: OffsideColors.textPrimary,
  },
  bodyMedium: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 20,
    color: OffsideColors.textPrimary,
  },
  bodySemiBold: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: OffsideColors.textPrimary,
  },
  bodySmall: {
    fontFamily: FontFamily.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: OffsideColors.textSecondary,
  },

  // ─── Special ───────────────────────────────────
  score: {
    fontFamily: FontFamily.soraExtraBold,
    fontSize: 48,
    lineHeight: 56,
    color: OffsideColors.textPrimary,
    letterSpacing: -1,
  },
  scoreMedium: {
    fontFamily: FontFamily.soraBold,
    fontSize: 28,
    lineHeight: 34,
    color: OffsideColors.textPrimary,
    letterSpacing: -0.5,
  },
  stat: {
    fontFamily: FontFamily.soraBold,
    fontSize: 24,
    lineHeight: 28,
    color: OffsideColors.primaryGreen,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: FontFamily.interRegular,
    fontSize: 11,
    lineHeight: 14,
    color: OffsideColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 10,
    lineHeight: 14,
  },
  chip: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  minute: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: OffsideColors.primaryGreen,
  },
  greeting: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: 20,
    lineHeight: 28,
    color: OffsideColors.textPrimary,
  },
} as const;
