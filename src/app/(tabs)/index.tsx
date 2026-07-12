/**
 * Home Screen — Offside AI Command Center
 * Greeting, Live Matches, Today's Fixtures, AI Predictor, AI Insights
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { router } from 'expo-router';

import { LiveMatchCard } from '@/components/cards/LiveMatchCard';
import { FixtureCard } from '@/components/cards/FixtureCard';
import { PredictionCard } from '@/components/cards/PredictionCard';
import { InsightCard } from '@/components/cards/InsightCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { getLiveFixtures, getTodayFixtures } from '@/services/api-football';
import type { Fixture } from '@/data/mock';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [liveFixtures, setLiveFixtures] = useState<Fixture[]>([]);
  const [todayFixtures, setTodayFixtures] = useState<Fixture[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [live, today] = await Promise.all([
        getLiveFixtures(),
        getTodayFixtures(),
      ]);
      setLiveFixtures(live);
      setTodayFixtures(today.filter((f) => !['LIVE', '1H', '2H', 'HT'].includes(f.status.short)));
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);



  if (isInitialLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading Home...</Text>
      </View>
    );
  }

  // Featured match for prediction (first live match or first upcoming)
  const featuredMatch = liveFixtures[0] || todayFixtures[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={OffsideColors.primaryGreen}
          />
        }
      >


        {/* Live Matches Section */}
        {liveFixtures.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <SectionHeader title="LIVE MATCHES" actionText="See All" onAction={() => router.push('/matches')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.liveScroll}
            >
              {liveFixtures.map((fixture, index) => (
                <Animated.View key={fixture.id} entering={FadeInRight.delay(300 + index * 100).duration(500)}>
                  <LiveMatchCard
                    fixture={fixture}
                    onPress={() => router.push(`/match/${fixture.id}`)}
                  />
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Today's Fixtures */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <SectionHeader title="TODAY'S FIXTURES" actionText="See All" onAction={() => router.push('/matches')} />
          {todayFixtures.slice(0, 4).map((fixture, index) => (
            <Animated.View key={fixture.id} entering={FadeInDown.delay(500 + index * 80).duration(500)}>
              <FixtureCard
                fixture={fixture}
                onPress={() => router.push(`/match/${fixture.id}`)}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* AI Match Predictor */}
        {featuredMatch?.prediction && (
          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.predictionSection}>
            <SectionHeader title="AI MATCH PREDICTOR" />
            <PredictionCard
              homeTeam={featuredMatch.teams.home.shortName}
              awayTeam={featuredMatch.teams.away.shortName}
              homeWin={featuredMatch.prediction.homeWin}
              draw={featuredMatch.prediction.draw}
              awayWin={featuredMatch.prediction.awayWin}
              advice={featuredMatch.prediction.advice}
            />
          </Animated.View>
        )}



        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    fontSize: 15,
  },
  userName: {
    ...Typography.screenTitle,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OffsideColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: OffsideColors.primaryGreen,
  },
  liveScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  predictionSection: {
    marginTop: 8,
  },
  insightSection: {
    marginTop: 20,
  },
});
