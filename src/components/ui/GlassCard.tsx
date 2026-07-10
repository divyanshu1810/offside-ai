/**
 * GlassCard — Offside AI
 * Base card component with tactical dark theme styling.
 * Optional neon glow border for live/featured content.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { OffsideColors, BorderRadius, Shadows } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  glowColor?: string;
  elevated?: boolean;
  onPress?: () => void;
}

export function GlassCard({ children, style, glow, glowColor, elevated, onPress }: GlassCardProps) {
  const cardStyle: ViewStyle[] = [
    styles.card,
    elevated ? styles.elevated : undefined,
    glow
      ? {
          borderColor: glowColor ?? OffsideColors.primaryGreen,
          borderWidth: 1,
          ...(Shadows.glow as ViewStyle),
          shadowColor: glowColor ?? OffsideColors.primaryGreen,
        }
      : undefined,
    style,
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed ? styles.pressed : undefined,
        ].filter(Boolean)}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
    ...Shadows.card,
  } as ViewStyle,
  elevated: {
    backgroundColor: OffsideColors.cardElevated,
    ...Shadows.cardElevated,
  } as ViewStyle,
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
