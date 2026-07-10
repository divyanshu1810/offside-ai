/**
 * Stats Screen — Offside AI
 * Player search, profile, comparison with radar charts and heatmaps.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PlayerCard } from '@/components/cards/PlayerCard';
import { RadarChart } from '@/components/ui/RadarChart';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppIcon } from '@/components/ui/AppIcon';
import { PitchView } from '@/components/pitch/PitchView';
import { HeatmapOverlay } from '@/components/pitch/HeatmapOverlay';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { searchPlayers } from '@/services/api-football';
import { MOCK_PLAYERS, type Player } from '@/data/mock';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [comparePlayer, setComparePlayer] = useState<Player | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await searchPlayers(query);
    setSearchResults(results);
  }, []);

  const selectPlayer = (player: Player) => {
    if (isComparing && selectedPlayer) {
      setComparePlayer(player);
      setIsComparing(false);
    } else {
      setSelectedPlayer(player);
      setComparePlayer(null);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const getRadarStats = (player: Player): number[] => {
    const s = player.stats;
    return [s.pace ?? 70, s.shooting ?? 70, s.passing ?? 70, s.dribbling ?? 70, s.defending ?? 70, s.physical ?? 70];
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.subtitle}>Player Comparison & Analysis</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AppIcon
          name={AppIcons.search}
          size={17}
          color={OffsideColors.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          placeholderTextColor={OffsideColors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {isComparing && (
          <View style={styles.comparingBadge}>
            <Text style={styles.comparingText}>vs</Text>
          </View>
        )}
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((player) => (
            <Pressable key={player.id} onPress={() => selectPlayer(player)}>
              <PlayerCard player={player} compact />
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* No player selected — show featured players */}
        {!selectedPlayer && (
          <Animated.View entering={FadeInDown.duration(500)}>
            <SectionHeader title="FEATURED PLAYERS" />
            <View style={styles.featuredGrid}>
              {MOCK_PLAYERS.slice(0, 4).map((player) => (
                <Pressable key={player.id} onPress={() => selectPlayer(player)} style={styles.featuredItem}>
                  <PlayerCard player={player} compact />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Selected Player Profile */}
        {selectedPlayer && (
          <Animated.View entering={FadeInDown.duration(500)}>
            {/* Player Card */}
            <View style={styles.playerCardSection}>
              <PlayerCard player={selectedPlayer} />
            </View>

            {/* Compare Button */}
            <View style={styles.actionRow}>
              <Pressable
                style={styles.compareButton}
                onPress={() => {
                  if (comparePlayer) {
                    setComparePlayer(null);
                  } else {
                    setIsComparing(true);
                  }
                }}
              >
                <AppIcon
                  name={comparePlayer ? AppIcons.close : AppIcons.compare}
                  size={15}
                  color={OffsideColors.primaryGreen}
                />
                <Text style={styles.compareButtonText}>
                  {comparePlayer ? 'Clear Comparison' : 'Compare Player'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  setSelectedPlayer(null);
                  setComparePlayer(null);
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>

            {/* Radar Chart */}
            <GlassCard style={styles.radarSection}>
              <Text style={styles.radarTitle}>Attribute Comparison</Text>
              <View style={styles.radarContainer}>
                <RadarChart
                  player1Stats={getRadarStats(selectedPlayer)}
                  player2Stats={comparePlayer ? getRadarStats(comparePlayer) : undefined}
                  player1Name={selectedPlayer.name}
                  player2Name={comparePlayer?.name}
                  size={280}
                />
              </View>
            </GlassCard>

            {/* Heatmap */}
            <GlassCard style={styles.heatmapSection}>
              <Text style={styles.heatmapTitle}>Positional Heatmap</Text>
              <Text style={styles.heatmapSubtitle}>
                {selectedPlayer.name} ({selectedPlayer.position}) Heat Zones
              </Text>
              <View style={styles.heatmapContainer}>
                <PitchView width={280} height={380}>
                  <HeatmapOverlay
                    position={selectedPlayer.position}
                    width={280}
                    height={380}
                  />
                </PitchView>
              </View>
            </GlassCard>

            {/* Comparison Stats Table */}
            {comparePlayer && (
              <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <GlassCard style={styles.comparisonTable}>
                  <View style={styles.compTableHeader}>
                    <Text style={styles.compTableName}>{selectedPlayer.name}</Text>
                    <Text style={styles.compTableVs}>vs</Text>
                    <Text style={styles.compTableName}>{comparePlayer.name}</Text>
                  </View>
                  <CompRow label="Goals" v1={selectedPlayer.stats.goals} v2={comparePlayer.stats.goals} />
                  <CompRow label="Assists" v1={selectedPlayer.stats.assists} v2={comparePlayer.stats.assists} />
                  <CompRow label="Apps" v1={selectedPlayer.stats.appearances} v2={comparePlayer.stats.appearances} />
                  <CompRow label="xG" v1={selectedPlayer.stats.xG} v2={comparePlayer.stats.xG} decimals={1} />
                  <CompRow label="Rating" v1={selectedPlayer.stats.rating} v2={comparePlayer.stats.rating} decimals={1} />
                </GlassCard>
              </Animated.View>
            )}
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function CompRow({ label, v1, v2, decimals = 0 }: { label: string; v1: number; v2: number; decimals?: number }) {
  const format = (n: number) => (decimals > 0 ? n.toFixed(decimals) : String(n));
  const isV1Better = v1 > v2;
  const isV2Better = v2 > v1;
  return (
    <View style={compStyles.row}>
      <Text style={[compStyles.value, isV1Better && compStyles.valueBetter]}>{format(v1)}</Text>
      <Text style={compStyles.label}>{label}</Text>
      <Text style={[compStyles.value, isV2Better && compStyles.valueBetter]}>{format(v2)}</Text>
    </View>
  );
}

const compStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  value: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textSecondary,
    width: 50,
    textAlign: 'center',
  },
  valueBetter: {
    color: OffsideColors.primaryGreen,
  },
  label: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...Typography.screenTitle,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.md,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: OffsideColors.textPrimary,
    paddingVertical: 12,
  },
  comparingBadge: {
    backgroundColor: OffsideColors.secondaryBlueDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  comparingText: {
    ...Typography.badge,
    color: OffsideColors.secondaryBlue,
    fontSize: 10,
  },
  searchResults: {
    paddingHorizontal: 20,
    gap: 6,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  featuredGrid: {
    paddingHorizontal: 20,
    gap: 8,
  },
  featuredItem: {
    marginBottom: 4,
  },
  playerCardSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  compareButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: OffsideColors.primaryGreenDim,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: OffsideColors.primaryGreen,
  },
  compareButtonText: {
    ...Typography.bodySemiBold,
    color: OffsideColors.primaryGreen,
    fontSize: 13,
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  clearButtonText: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    fontSize: 13,
  },
  radarSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
  },
  radarTitle: {
    ...Typography.cardTitle,
    color: OffsideColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  radarContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  heatmapSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  heatmapTitle: {
    ...Typography.cardTitle,
    color: OffsideColors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  heatmapSubtitle: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  heatmapContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  comparisonTable: {
    marginHorizontal: 20,
    padding: 16,
  },
  compTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  compTableName: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
    fontSize: 12,
    width: 80,
    textAlign: 'center',
  },
  compTableVs: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
  },
});
