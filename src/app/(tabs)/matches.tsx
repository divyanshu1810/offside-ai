/**
 * Matches Screen — Offside AI
 * Fixture list with date selector and league filters.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { FixtureCard } from '@/components/cards/FixtureCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { getFixturesByDate } from '@/services/api-football';
import { LEAGUE_METADATA, type Fixture } from '@/data/mock';

type DateFilter = 'yesterday' | 'today' | 'tomorrow';

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [leagueFilter, setLeagueFilter] = useState<number | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const offset = dateFilter === 'yesterday' ? -1 : dateFilter === 'tomorrow' ? 1 : 0;
    const data = await getFixturesByDate(offset);
    setFixtures(data);
  }, [dateFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Group fixtures by league
  const groupedFixtures = fixtures.reduce<Record<string, Fixture[]>>((acc, fixture) => {
    const leagueName = fixture.league.name;
    if (leagueFilter && fixture.league.id !== leagueFilter) return acc;
    if (!acc[leagueName]) acc[leagueName] = [];
    acc[leagueName]!.push(fixture);
    return acc;
  }, {});

  // Sort live matches first
  const sortedGroups = Object.entries(groupedFixtures).sort(([, a], [, b]) => {
    const aHasLive = a!.some((f) => ['LIVE', '1H', '2H', 'HT'].includes(f.status.short));
    const bHasLive = b!.some((f) => ['LIVE', '1H', '2H', 'HT'].includes(f.status.short));
    if (aHasLive && !bHasLive) return -1;
    if (!aHasLive && bHasLive) return 1;
    return 0;
  });

  const availableLeagues = [...new Set(fixtures.map((f) => f.league.id))];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
      </View>

      {/* Date Filter */}
      <View style={styles.dateFilterRow}>
        {(['yesterday', 'today', 'tomorrow'] as DateFilter[]).map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setDateFilter(filter)}
            style={[
              styles.dateChip,
              dateFilter === filter && styles.dateChipActive,
            ]}
          >
            <Text
              style={[
                styles.dateChipText,
                dateFilter === filter && styles.dateChipTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* League Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.leagueFilterScroll}
      >
        <Pressable
          onPress={() => setLeagueFilter(null)}
          style={[styles.leagueChip, !leagueFilter && styles.leagueChipActive]}
        >
          <Text style={[styles.leagueChipText, !leagueFilter && styles.leagueChipTextActive]}>
            All
          </Text>
        </Pressable>
        {availableLeagues.map((leagueId) => {
          const meta = LEAGUE_METADATA[leagueId];
          return (
            <Pressable
              key={leagueId}
              onPress={() => setLeagueFilter(leagueId)}
              style={[styles.leagueChip, leagueFilter === leagueId && styles.leagueChipActive]}
            >
              <AppIcon
                name={meta?.icon ?? AppIcons.football}
                size={14}
                color={leagueFilter === leagueId ? OffsideColors.primaryGreen : meta?.color ?? OffsideColors.textSecondary}
              />
              <Text
                style={[
                  styles.leagueChipText,
                  leagueFilter === leagueId && styles.leagueChipTextActive,
                ]}
              >
                {meta?.name || `League ${leagueId}`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Fixture List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={OffsideColors.primaryGreen} />
        }
      >
        {sortedGroups.map(([league, leagueFixtures], groupIndex) => (
          <Animated.View
            key={league}
            entering={FadeInDown.delay(groupIndex * 100).duration(500)}
          >
            <View style={styles.leagueHeader}>
              <Text style={styles.leagueName}>{league}</Text>
              <Text style={styles.leagueCount}>{leagueFixtures!.length}</Text>
            </View>
            {leagueFixtures!.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                onPress={() => router.push(`/match/${fixture.id}`)}
              />
            ))}
          </Animated.View>
        ))}

        {sortedGroups.length === 0 && (
          <View style={styles.emptyState}>
            <AppIcon name={AppIcons.football} size={48} color={OffsideColors.textTertiary} />
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyText}>No fixtures scheduled for this day.</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    ...Typography.screenTitle,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  dateChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: OffsideColors.card,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  dateChipActive: {
    backgroundColor: OffsideColors.primaryGreenDim,
    borderColor: OffsideColors.primaryGreen,
  },
  dateChipText: {
    ...Typography.chip,
    color: OffsideColors.textSecondary,
  },
  dateChipTextActive: {
    color: OffsideColors.primaryGreen,
  },
  leagueFilterScroll: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  leagueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: OffsideColors.card,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
    gap: 4,
  },
  leagueChipActive: {
    backgroundColor: OffsideColors.primaryGreenDim,
    borderColor: OffsideColors.primaryGreen,
  },
  leagueChipText: {
    ...Typography.chip,
    color: OffsideColors.textSecondary,
    fontSize: 12,
  },
  leagueChipTextActive: {
    color: OffsideColors.primaryGreen,
  },
  scrollView: {
    flex: 1,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  leagueName: {
    ...Typography.cardTitle,
    color: OffsideColors.textSecondary,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leagueCount: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    color: OffsideColors.textSecondary,
  },
  emptyText: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
  },
});
