/**
 * PredictionCard — Offside AI
 * Win probability donut chart with animated percentages and AI advice.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PredictionCardProps {
  homeTeam: string;
  awayTeam: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  advice?: string;
}

export function PredictionCard({
  homeTeam,
  awayTeam,
  homeWin,
  draw,
  awayWin,
  advice,
}: PredictionCardProps) {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const homeProgress = useSharedValue(0);
  const drawProgress = useSharedValue(0);

  useEffect(() => {
    homeProgress.value = withTiming(homeWin / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
    drawProgress.value = withTiming((homeWin + draw) / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [homeWin, draw]);

  const homeArcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - homeProgress.value),
  }));

  const drawArcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - drawProgress.value),
  }));

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>AI Match Predictor</Text>
      <Text style={styles.subtitle}>
        {homeTeam} vs {awayTeam}
      </Text>

      <View style={styles.content}>
        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            {/* Background circle */}
            <Circle
              cx={65}
              cy={65}
              r={radius}
              stroke={OffsideColors.cardBorder}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Away arc (bottom layer — red/blue) */}
            <Circle
              cx={65}
              cy={65}
              r={radius}
              stroke={OffsideColors.secondaryBlue}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(-90 65 65)`}
            />
            {/* Draw arc (middle layer) */}
            <AnimatedCircle
              cx={65}
              cy={65}
              r={radius}
              stroke={OffsideColors.textTertiary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={drawArcProps}
              strokeLinecap="round"
              transform={`rotate(-90 65 65)`}
            />
            {/* Home arc (top layer — green) */}
            <AnimatedCircle
              cx={65}
              cy={65}
              r={radius}
              stroke={OffsideColors.primaryGreen}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={homeArcProps}
              strokeLinecap="round"
              transform={`rotate(-90 65 65)`}
            />
          </Svg>
          {/* Center text */}
          <View style={styles.chartCenter}>
            <Text style={styles.centerPercent}>{homeWin}%</Text>
            <Text style={styles.centerLabel}>{homeTeam}</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: OffsideColors.primaryGreen }]} />
            <Text style={styles.legendText}>{homeWin}% {homeTeam}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: OffsideColors.textTertiary }]} />
            <Text style={styles.legendText}>{draw}% Draw</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: OffsideColors.secondaryBlue }]} />
            <Text style={styles.legendText}>{awayWin}% {awayTeam}</Text>
          </View>
        </View>
      </View>

      {/* AI Advice */}
      {advice && (
        <View style={styles.adviceContainer}>
          <AppIcon
            name={AppIcons.ai}
            size={15}
            color={OffsideColors.primaryGreen}
            style={styles.adviceIcon}
          />
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 18,
  },
  title: {
    ...Typography.cardTitle,
    color: OffsideColors.primaryGreen,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  chartContainer: {
    width: 130,
    height: 130,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerPercent: {
    ...Typography.scoreMedium,
    fontSize: 24,
    color: OffsideColors.primaryGreen,
  },
  centerLabel: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  legend: {
    flex: 1,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    fontSize: 13,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: OffsideColors.cardBorder,
  },
  adviceIcon: {
    marginTop: 1,
  },
  adviceText: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
