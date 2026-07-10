/**
 * LineupOverlay — Offside AI
 * Players positioned on PitchView by formation grid positions.
 * Jersey number circles with player names.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import type { Player } from '@/data/mock';

interface LineupOverlayProps {
  players: Player[];
  formation: string;
  pitchWidth: number;
  pitchHeight: number;
  isAway?: boolean;
  teamColor?: string;
}

export function LineupOverlay({
  players,
  formation,
  pitchWidth,
  pitchHeight,
  isAway = false,
  teamColor = OffsideColors.primaryGreen,
}: LineupOverlayProps) {
  // Parse grid positions from player data and calculate positions
  const horizontalPadding = 24;
  const verticalPadding = 36;
  const usableWidth = pitchWidth - horizontalPadding * 2;
  const usableHeight = pitchHeight / 2 - verticalPadding * 2;

  // Group players by grid row
  const rows: Map<number, Player[]> = new Map();
  players.forEach((player) => {
    if (!player.grid) return;
    const [rowStr] = player.grid.split(':');
    const row = parseInt(rowStr!, 10);
    if (!rows.has(row)) rows.set(row, []);
    rows.get(row)!.push(player);
  });

  const totalRows = rows.size || 4;

  return (
    <View style={[
      styles.container,
      {
        width: pitchWidth,
        height: pitchHeight / 2,
        top: isAway ? 0 : pitchHeight / 2,
      },
    ]}>
      {/* Formation label */}
      <View style={[styles.formationBadge, isAway ? styles.formationTop : styles.formationBottom]}>
        <Text style={styles.formationText}>{formation}</Text>
      </View>

      {Array.from(rows.entries()).map(([rowIdx, rowPlayers]) => {
        // For away team, reverse the row order (goalkeeper at top)
        const yProgress = isAway
          ? (rowIdx - 1) / Math.max(totalRows - 1, 1)
          : 1 - (rowIdx - 1) / Math.max(totalRows - 1, 1);

        const y = verticalPadding + yProgress * usableHeight;

        return rowPlayers.map((player, colIdx) => {
          const totalInRow = rowPlayers.length;
          const x = horizontalPadding + ((colIdx + 0.5) / totalInRow) * usableWidth;

          return (
            <View
              key={player.id}
              style={[
                styles.playerContainer,
                {
                  left: x - 22,
                  top: y - 16,
                },
              ]}
            >
              <View style={[styles.jerseyCircle, { borderColor: teamColor }]}>
                <Text style={[styles.jerseyNumber, { color: teamColor }]}>
                  {player.number}
                </Text>
              </View>
              <Text style={styles.playerName} numberOfLines={1}>
                {player.name.split(' ').pop()}
              </Text>
            </View>
          );
        });
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  formationBadge: {
    position: 'absolute',
    backgroundColor: OffsideColors.cardElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    zIndex: 10,
    alignSelf: 'center',
  },
  formationTop: {
    top: 4,
  },
  formationBottom: {
    bottom: 4,
  },
  formationText: {
    ...Typography.badge,
    color: OffsideColors.primaryGreen,
    fontSize: 11,
  },
  playerContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 44,
  },
  jerseyCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyNumber: {
    ...Typography.bodySemiBold,
    fontSize: 12,
  },
  playerName: {
    ...Typography.bodySmall,
    color: OffsideColors.textPrimary,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
