/**
 * PlayerCard — Offside AI
 * FIFA Ultimate Team inspired player card with stats, rating badge, and neon glow.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OffsideColors, BorderRadius, Shadows } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import type { Player } from '@/data/mock';

interface PlayerCardProps {
  player: Player;
  onPress?: () => void;
  compact?: boolean;
}

export function PlayerCard({ player, compact }: PlayerCardProps) {
  const { stats } = player;

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactAvatar}>
          <Text style={styles.compactAvatarText}>{player.firstName[0]}{player.lastName[0]}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{player.name}</Text>
          <Text style={styles.compactTeam}>{player.team.shortName} · {player.position}</Text>
        </View>
        <View style={styles.compactRating}>
          <Text style={styles.compactRatingText}>{stats.rating.toFixed(1)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#1C2333', '#161B22', '#0D1117']}
        style={styles.gradient}
      >
        {/* Header: Position & OVR */}
        <View style={styles.header}>
          <View>
            <Text style={styles.position}>{player.position}</Text>
            <Text style={styles.teamName}>{player.team.name}</Text>
          </View>
          <View style={styles.ovrBadge}>
            <Text style={styles.ovrNumber}>{Math.round(stats.rating * 10)}</Text>
            <Text style={styles.ovrLabel}>OVR</Text>
          </View>
        </View>

        {/* Player Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {player.firstName[0]}{player.lastName[0]}
            </Text>
          </View>
        </View>

        {/* Player Name */}
        <Text style={styles.playerName}>{player.firstName}</Text>
        <Text style={styles.playerLastName}>{player.lastName}</Text>

        {/* Key Stats Row */}
        <View style={styles.statsRow}>
          <StatPill label="Apps" value={stats.appearances} />
          <StatPill label="Goals" value={stats.goals} />
          <StatPill label="Assists" value={stats.assists} />
          <StatPill label="xG" value={stats.xG} decimals={1} />
        </View>

        {/* FIFA-style Attributes */}
        {stats.pace !== undefined && (
          <View style={styles.attributesGrid}>
            <AttributeRow label="PAC" value={stats.pace!} />
            <AttributeRow label="SHO" value={stats.shooting!} />
            <AttributeRow label="PAS" value={stats.passing!} />
            <AttributeRow label="DRI" value={stats.dribbling!} />
            <AttributeRow label="DEF" value={stats.defending!} />
            <AttributeRow label="PHY" value={stats.physical!} />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

function StatPill({ label, value, decimals = 0 }: { label: string; value: number; decimals?: number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{decimals > 0 ? value.toFixed(decimals) : value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AttributeRow({ label, value }: { label: string; value: number }) {
  const barWidth = `${value}%`;
  const color = value >= 85 ? OffsideColors.primaryGreen :
                value >= 70 ? OffsideColors.warning :
                value >= 50 ? OffsideColors.textSecondary :
                OffsideColors.live;
  return (
    <View style={styles.attrRow}>
      <Text style={styles.attrLabel}>{label}</Text>
      <Text style={[styles.attrValue, { color }]}>{value}</Text>
      <View style={styles.attrBarBg}>
        <View style={[styles.attrBarFill, { width: barWidth as `${number}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: OffsideColors.primaryGreenDim,
    ...Shadows.card,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  position: {
    ...Typography.badge,
    color: OffsideColors.primaryGreen,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  teamName: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    marginTop: 2,
  },
  ovrBadge: {
    alignItems: 'center',
    backgroundColor: OffsideColors.primaryGreenDim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  ovrNumber: {
    ...Typography.scoreMedium,
    fontSize: 28,
    color: OffsideColors.primaryGreen,
  },
  ovrLabel: {
    ...Typography.badge,
    color: OffsideColors.primaryGreen,
    fontSize: 9,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: OffsideColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: OffsideColors.primaryGreenDim,
  },
  avatarText: {
    ...Typography.scoreMedium,
    fontSize: 24,
    color: OffsideColors.primaryGreen,
  },
  playerName: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    textAlign: 'center',
  },
  playerLastName: {
    ...Typography.screenTitle,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: OffsideColors.cardBorder,
  },
  statPill: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.stat,
    fontSize: 18,
  },
  statLabel: {
    ...Typography.statLabel,
    marginTop: 2,
  },
  attributesGrid: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: OffsideColors.cardBorder,
    gap: 8,
  },
  attrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attrLabel: {
    ...Typography.badge,
    color: OffsideColors.textSecondary,
    width: 30,
    fontSize: 10,
  },
  attrValue: {
    ...Typography.bodySemiBold,
    width: 28,
    textAlign: 'right',
    fontSize: 14,
  },
  attrBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: OffsideColors.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  attrBarFill: {
    height: 4,
    borderRadius: 2,
  },
  // Compact variant
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  compactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OffsideColors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactAvatarText: {
    ...Typography.bodySemiBold,
    color: OffsideColors.primaryGreen,
    fontSize: 13,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
  },
  compactTeam: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    fontSize: 12,
  },
  compactRating: {
    backgroundColor: OffsideColors.primaryGreenDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  compactRatingText: {
    ...Typography.bodySemiBold,
    color: OffsideColors.primaryGreen,
    fontSize: 14,
  },
});
