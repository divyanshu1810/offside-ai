/**
 * StatBar — Offside AI
 * Horizontal comparison bar for match stats (e.g., Possession: 62% vs 38%).
 * Animated fill with team colors.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
  suffix?: string;
}

export function StatBar({ label, homeValue, awayValue, isPercentage = false, suffix = '' }: StatBarProps) {
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;

  const animatedWidth = useSharedValue(50);

  useEffect(() => {
    animatedWidth.value = withTiming(homePercent, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [homePercent]);

  const homeBarStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%` as `${number}%`,
  }));

  const awayBarStyle = useAnimatedStyle(() => ({
    width: `${100 - animatedWidth.value}%` as `${number}%`,
  }));

  const homeHigher = homeValue > awayValue;
  const awayHigher = awayValue > homeValue;

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={[styles.value, homeHigher && styles.valueHighlight]}>
          {homeValue}{isPercentage ? '%' : ''}{suffix}
        </Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, awayHigher && styles.valueHighlight]}>
          {awayValue}{isPercentage ? '%' : ''}{suffix}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.homeBar, homeBarStyle]}>
          <View style={[styles.barFill, homeHigher ? styles.barFillHighlight : styles.barFillDim]} />
        </Animated.View>
        <Animated.View style={[styles.awayBar, awayBarStyle]}>
          <View style={[styles.barFill, awayHigher ? styles.barFillHighlight : styles.barFillDim]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  value: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textSecondary,
    fontSize: 14,
    minWidth: 36,
  },
  valueHighlight: {
    color: OffsideColors.textPrimary,
  },
  barContainer: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  homeBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  awayBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  barFill: {
    flex: 1,
    borderRadius: 3,
  },
  barFillHighlight: {
    backgroundColor: OffsideColors.primaryGreen,
  },
  barFillDim: {
    backgroundColor: OffsideColors.textTertiary,
  },
});
