/**
 * FixtureCard — Offside AI
 * Upcoming match card with teams, time, and league badge.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import type { Fixture } from '@/data/mock';

interface FixtureCardProps {
  fixture: Fixture;
  onPress?: () => void;
}

export function FixtureCard({ fixture, onPress }: FixtureCardProps) {
  const isFinished = fixture.status.short === 'FT';
  const isLive = ['LIVE', '1H', '2H', 'HT'].includes(fixture.status.short);

  const getTimeDisplay = () => {
    if (isFinished) return 'FT';
    if (isLive) return `${fixture.status.elapsed}'`;
    const date = new Date(fixture.date);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <GlassCard onPress={onPress} style={styles.card} glow={isLive} glowColor={OffsideColors.primaryGreen}>
      {/* Time / Status */}
      <View style={styles.timeSection}>
        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{fixture.status.elapsed}&apos;</Text>
          </View>
        ) : (
          <Text style={[styles.time, isFinished && styles.timeFT]}>{getTimeDisplay()}</Text>
        )}
      </View>

      {/* Teams */}
      <View style={styles.teamsSection}>
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamBadge}>
              <AppIcon name={AppIcons.football} size={14} color={OffsideColors.primaryGreen} />
            </View>
            <Text
              style={[
                styles.teamName,
                isFinished && fixture.teams.home.winner && styles.teamNameWinner,
              ]}
              numberOfLines={1}
            >
              {fixture.teams.home.name}
            </Text>
          </View>
          {(isLive || isFinished) && (
            <Text style={[styles.score, fixture.teams.home.winner && styles.scoreWinner]}>
              {fixture.goals.home}
            </Text>
          )}
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamBadge}>
              <AppIcon name={AppIcons.football} size={14} color={OffsideColors.primaryGreen} />
            </View>
            <Text
              style={[
                styles.teamName,
                isFinished && fixture.teams.away.winner && styles.teamNameWinner,
              ]}
              numberOfLines={1}
            >
              {fixture.teams.away.name}
            </Text>
          </View>
          {(isLive || isFinished) && (
            <Text style={[styles.score, fixture.teams.away.winner && styles.scoreWinner]}>
              {fixture.goals.away}
            </Text>
          )}
        </View>
      </View>

      {/* League */}
      <View style={styles.leagueSection}>
        <Text style={styles.league}>{fixture.league.name}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  timeSection: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  time: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    fontSize: 12,
  },
  timeFT: {
    color: OffsideColors.textTertiary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: OffsideColors.liveDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: OffsideColors.live,
  },
  liveText: {
    ...Typography.badge,
    color: OffsideColors.live,
    fontSize: 10,
  },
  teamsSection: {
    gap: 10,
    marginRight: 60,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: OffsideColors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    ...Typography.body,
    color: OffsideColors.textPrimary,
    flex: 1,
  },
  teamNameWinner: {
    fontWeight: '700',
  },
  score: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textSecondary,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'right',
  },
  scoreWinner: {
    color: OffsideColors.textPrimary,
  },
  leagueSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: OffsideColors.cardBorder,
  },
  league: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    fontSize: 11,
  },
});
