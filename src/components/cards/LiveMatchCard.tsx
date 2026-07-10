/**
 * LiveMatchCard — Offside AI
 * Live match card with pulsing LIVE badge, team names, score, and minute.
 * Neon green glow border on live matches.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import type { Fixture } from '@/data/mock';

interface LiveMatchCardProps {
  fixture: Fixture;
  onPress?: () => void;
}

export function LiveMatchCard({ fixture, onPress }: LiveMatchCardProps) {
  const pulseOpacity = useSharedValue(1);
  const glowIntensity = useSharedValue(0.3);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const liveBadgeStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const isLive = fixture.status.short === 'LIVE' || fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT';

  return (
    <GlassCard
      glow={isLive}
      glowColor={OffsideColors.primaryGreen}
      onPress={onPress}
      style={styles.card}
    >
      {/* League & Live Badge */}
      <View style={styles.header}>
        <Text style={styles.league} numberOfLines={1}>
          {fixture.league.name}
        </Text>
        {isLive && (
          <Animated.View style={[styles.liveBadge, liveBadgeStyle]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </Animated.View>
        )}
        {isLive && fixture.status.elapsed && (
          <Text style={styles.minute}>{fixture.status.elapsed}&apos;</Text>
        )}
      </View>

      {/* Teams & Score */}
      <View style={styles.matchRow}>
        <View style={styles.teamSection}>
          <View style={styles.teamLogoPlaceholder}>
            <AppIcon name={AppIcons.football} size={15} color={OffsideColors.primaryGreen} />
          </View>
          <Text style={styles.teamName} numberOfLines={1}>
            {fixture.teams.home.name}
          </Text>
        </View>
        <View style={styles.scoreSection}>
          <Text style={styles.score}>
            {fixture.goals.home ?? 0}
          </Text>
        </View>
      </View>

      <View style={styles.matchRow}>
        <View style={styles.teamSection}>
          <View style={styles.teamLogoPlaceholder}>
            <AppIcon name={AppIcons.football} size={15} color={OffsideColors.primaryGreen} />
          </View>
          <Text style={styles.teamName} numberOfLines={1}>
            {fixture.teams.away.name}
          </Text>
        </View>
        <View style={styles.scoreSection}>
          <Text style={styles.score}>
            {fixture.goals.away ?? 0}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  league: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OffsideColors.liveDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: OffsideColors.live,
  },
  liveText: {
    ...Typography.badge,
    color: OffsideColors.live,
    fontSize: 9,
  },
  minute: {
    ...Typography.minute,
    fontSize: 13,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  teamLogoPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: OffsideColors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
    flex: 1,
  },
  scoreSection: {
    minWidth: 30,
    alignItems: 'flex-end',
  },
  score: {
    ...Typography.scoreMedium,
    fontSize: 22,
    color: OffsideColors.textPrimary,
  },
});
