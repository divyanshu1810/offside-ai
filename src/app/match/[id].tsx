/**
 * Match Detail Screen — Offside AI
 * Full match view with score header, tabs (Overview/Timeline/Stats/Lineups),
 * and AI tactical analysis.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { StatBar } from '@/components/ui/StatBar';
import { MatchTimeline } from '@/components/ui/MatchTimeline';
import { InsightCard } from '@/components/cards/InsightCard';
import { PitchView } from '@/components/pitch/PitchView';
import { LineupOverlay } from '@/components/pitch/LineupOverlay';
import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { getFixtureDetails } from '@/services/api-football';
import type { Fixture } from '@/data/mock';

type Tab = 'overview' | 'timeline' | 'stats' | 'lineups';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [fixture, setFixture] = useState<Fixture | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMatchData = async () => {
        const numericId = parseInt(id, 10);
        const [fixtureData, eventsData, statsData, lineupsData, predData] = await Promise.all([
          getFixtureDetails(numericId),
          import('@/services/api-football').then(m => m.getFixtureEvents(numericId)),
          import('@/services/api-football').then(m => m.getFixtureStatistics(numericId)),
          import('@/services/api-football').then(m => m.getFixtureLineups(numericId)),
          import('@/services/api-football').then(m => m.getMatchPrediction(numericId)),
        ]);

        if (fixtureData) {
          // Merge real API data into the fixture object if it was fetched from the network
          // Note: Mock data already has these nested. Real API-Football data needs manual mapping for stats/events/lineups
          const updatedFixture = { ...fixtureData };
          
          if (eventsData && eventsData.length > 0) {
            updatedFixture.events = eventsData.map((e: any) => ({
              time: { elapsed: e.time?.elapsed ?? 0, extra: e.time?.extra },
              team: { id: e.team?.id ?? 0, name: e.team?.name ?? '' },
              player: { id: e.player?.id ?? 0, name: e.player?.name ?? '' },
              assist: { id: e.assist?.id ?? null, name: e.assist?.name ?? null },
              type: e.type,
              detail: e.detail,
              comments: e.comments,
            }));
          }
          
          if (statsData && statsData.length > 0) {
            const homeStatsObj = statsData.find((s: any) => s.team.id === fixtureData.teams.home.id) || statsData[0];
            const awayStatsObj = statsData.find((s: any) => s.team.id === fixtureData.teams.away.id) || statsData[1];

            const homeStats = homeStatsObj?.statistics || [];
            const awayStats = awayStatsObj?.statistics || [];

            const getStat = (arr: any[], type: string) => {
              if (!arr) return 0;
              const item = arr.find((s: any) => s.type === type);
              let val = item?.value ?? 0;
              if (typeof val === 'string' && val.includes('%')) val = parseInt(val, 10);
              return val;
            };
            
            updatedFixture.statistics = {
              possession: [getStat(homeStats, 'Ball Possession'), getStat(awayStats, 'Ball Possession')],
              shots: [getStat(homeStats, 'Total Shots'), getStat(awayStats, 'Total Shots')],
              shotsOnTarget: [getStat(homeStats, 'Shots on Goal'), getStat(awayStats, 'Shots on Goal')],
              corners: [getStat(homeStats, 'Corner Kicks'), getStat(awayStats, 'Corner Kicks')],
              fouls: [getStat(homeStats, 'Fouls'), getStat(awayStats, 'Fouls')],
              yellowCards: [getStat(homeStats, 'Yellow Cards'), getStat(awayStats, 'Yellow Cards')],
              redCards: [getStat(homeStats, 'Red Cards'), getStat(awayStats, 'Red Cards')],
              offsides: [getStat(homeStats, 'Offsides'), getStat(awayStats, 'Offsides')],
              xG: [getStat(homeStats, 'expected_goals'), getStat(awayStats, 'expected_goals')],
              passes: [getStat(homeStats, 'Total passes'), getStat(awayStats, 'Total passes')],
              passAccuracy: [getStat(homeStats, 'Passes %'), getStat(awayStats, 'Passes %')],
            };
          }

          if (lineupsData && lineupsData.length > 0) {
            const normalizeLineupPlayer = (p: any) => ({
              id: p.player?.id ?? 0,
              name: p.player?.name ?? '',
              firstName: '',
              lastName: '',
              age: 0,
              nationality: '',
              photo: '',
              position: p.player?.pos ?? '',
              number: p.player?.number ?? 0,
              team: { id: 0, name: '', shortName: '', logo: '', code: '' },
              stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 },
              grid: p.player?.grid ?? undefined,
            });

            const homeLineup = lineupsData.find((l: any) => l.team.id === fixtureData.teams.home.id) || lineupsData[0];
            const awayLineup = lineupsData.find((l: any) => l.team.id === fixtureData.teams.away.id) || lineupsData[1];

            if (homeLineup && awayLineup) {
              updatedFixture.lineups = {
                home: {
                  formation: homeLineup.formation,
                  players: homeLineup.startXI.map(normalizeLineupPlayer),
                },
                away: {
                  formation: awayLineup.formation,
                  players: awayLineup.startXI.map(normalizeLineupPlayer),
                },
              };
            }
          }

          if (predData && !fixtureData.prediction) {
            updatedFixture.prediction = predData;
          }

          setFixture(updatedFixture);
        }
      };
      
      fetchMatchData();
    }
  }, [id]);

  if (!fixture) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading match data...</Text>
        </View>
      </View>
    );
  }

  const isLive = ['LIVE', '1H', '2H', 'HT'].includes(fixture.status.short);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {/* Score Header */}
      <Animated.View entering={FadeIn.duration(600)} style={styles.scoreHeader}>
        <Text style={styles.leagueText}>{fixture.league.name}</Text>

        <View style={styles.scoreRow}>
          <View style={styles.teamCol}>
            <View style={styles.teamBadgeLarge}>
              <Text style={styles.teamBadgeText}>
                {fixture.teams.home.shortName.slice(0, 2)}
              </Text>
            </View>
            <Text style={styles.teamNameScore}>{fixture.teams.home.shortName}</Text>
          </View>

          <View style={styles.scoreCenterCol}>
            <Text style={styles.scoreBig}>
              {fixture.goals.home ?? 0} - {fixture.goals.away ?? 0}
            </Text>
            {isLive ? (
              <View style={styles.liveStatusBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveStatusText}>{fixture.status.elapsed}&apos;</Text>
              </View>
            ) : (
              <Text style={styles.statusText}>{fixture.status.short}</Text>
            )}
          </View>

          <View style={styles.teamCol}>
            <View style={styles.teamBadgeLarge}>
              <Text style={styles.teamBadgeText}>
                {fixture.teams.away.shortName.slice(0, 2)}
              </Text>
            </View>
            <Text style={styles.teamNameScore}>{fixture.teams.away.shortName}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Tab Selector */}
      <View style={styles.tabRow}>
        {(['overview', 'timeline', 'stats', 'lineups'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <OverviewTab fixture={fixture} />
          </Animated.View>
        )}
        {activeTab === 'timeline' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <TimelineTab fixture={fixture} />
          </Animated.View>
        )}
        {activeTab === 'stats' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <StatsTab fixture={fixture} />
          </Animated.View>
        )}
        {activeTab === 'lineups' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <LineupsTab fixture={fixture} />
          </Animated.View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─── Overview Tab ───────────────────────────────────────────────
import { chatWithCohere, buildMatchContext } from '@/services/cohere';

function OverviewTab({ fixture }: { fixture: Fixture }) {
  const stats = fixture.statistics;
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const generateInsights = async () => {
    setIsAiLoading(true);
    try {
      const matchContext = buildMatchContext(fixture as any);
      const prompt = `Give me 3-4 short bullet points on why the match is going the way it is, focusing on tactics and the current score.`;
      
      const response = await chatWithCohere([{ role: 'user', content: prompt }], 'tactical', matchContext);
      
      const bullets = response
        .split('\n')
        .map(b => b.replace(/^[-*✓]\s*/, '').trim())
        .filter(b => b.length > 10 && !b.toLowerCase().includes('here are'));
        
      setAiInsights(bullets.length > 0 ? bullets : [response]);
    } catch (err) {
      setAiInsights(['Failed to generate insights. Check your connection.']);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <View style={styles.tabPanel}>
      {stats && (
        <GlassCard style={styles.statsCard}>
          <StatBar label="Possession" homeValue={stats.possession[0]!} awayValue={stats.possession[1]!} isPercentage />
          <StatBar label="Shots" homeValue={stats.shots[0]!} awayValue={stats.shots[1]!} />
          <StatBar label="On Target" homeValue={stats.shotsOnTarget[0]!} awayValue={stats.shotsOnTarget[1]!} />
          <StatBar label="Corners" homeValue={stats.corners[0]!} awayValue={stats.corners[1]!} />
          <StatBar label="xG" homeValue={stats.xG[0]!} awayValue={stats.xG[1]!} />
        </GlassCard>
      )}

      {/* AI Insights Section */}
      <View style={{ marginTop: 20 }}>
        {!aiInsights && !isAiLoading && (
          <Pressable style={styles.aiButton} onPress={generateInsights}>
            <AppIcon name={AppIcons.analysis} size={20} color={OffsideColors.background} />
            <Text style={styles.aiButtonText}>Generate AI Tactical Insights</Text>
          </Pressable>
        )}
        
        {isAiLoading && (
          <View style={styles.aiLoading}>
            <Text style={styles.aiLoadingText}>Coach AI is analyzing the match...</Text>
          </View>
        )}

        {aiInsights && !isAiLoading && (
          <InsightCard
            title={`Tactical Analysis: ${fixture.teams.home.shortName} vs ${fixture.teams.away.shortName}`}
            icon={AppIcons.analysis}
            insights={aiInsights}
          />
        )}
      </View>

      {fixture.prediction && (
        <InsightCard
          title="AI Tactical Analysis"
          icon={AppIcons.analysis}
          insights={[
            fixture.prediction.advice,
            `Win probability: ${fixture.teams.home.shortName} ${fixture.prediction.homeWin}%`,
            `Draw: ${fixture.prediction.draw}% | ${fixture.teams.away.shortName}: ${fixture.prediction.awayWin}%`,
          ]}
        />
      )}
    </View>
  );
}

// ─── Timeline Tab ───────────────────────────────────────────────

function TimelineTab({ fixture }: { fixture: Fixture }) {
  return (
    <View style={styles.tabPanel}>
      <MatchTimeline
        events={fixture.events || []}
        homeTeamId={fixture.teams.home.id}
      />
    </View>
  );
}

// ─── Stats Tab ──────────────────────────────────────────────────

function StatsTab({ fixture }: { fixture: Fixture }) {
  const stats = fixture.statistics;
  if (!stats) {
    return (
      <View style={styles.tabPanel}>
        <Text style={styles.noDataText}>Stats not available for this match</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabPanel}>
      <GlassCard style={styles.statsCard}>
        <View style={styles.statsTeamHeader}>
          <Text style={styles.statsTeamName}>{fixture.teams.home.shortName}</Text>
          <Text style={styles.statsVs}>vs</Text>
          <Text style={styles.statsTeamName}>{fixture.teams.away.shortName}</Text>
        </View>
        <StatBar label="Possession" homeValue={stats.possession[0]!} awayValue={stats.possession[1]!} isPercentage />
        <StatBar label="Shots" homeValue={stats.shots[0]!} awayValue={stats.shots[1]!} />
        <StatBar label="Shots on Target" homeValue={stats.shotsOnTarget[0]!} awayValue={stats.shotsOnTarget[1]!} />
        <StatBar label="Corners" homeValue={stats.corners[0]!} awayValue={stats.corners[1]!} />
        <StatBar label="Fouls" homeValue={stats.fouls[0]!} awayValue={stats.fouls[1]!} />
        <StatBar label="Yellow Cards" homeValue={stats.yellowCards[0]!} awayValue={stats.yellowCards[1]!} />
        <StatBar label="xG" homeValue={stats.xG[0]!} awayValue={stats.xG[1]!} />
        <StatBar label="Passes" homeValue={stats.passes[0]!} awayValue={stats.passes[1]!} />
        <StatBar label="Pass Accuracy" homeValue={stats.passAccuracy[0]!} awayValue={stats.passAccuracy[1]!} isPercentage />
        <StatBar label="Offsides" homeValue={stats.offsides[0]!} awayValue={stats.offsides[1]!} />
      </GlassCard>
    </View>
  );
}

// ─── Lineups Tab ────────────────────────────────────────────────

function LineupsTab({ fixture }: { fixture: Fixture }) {
  const lineups = fixture.lineups;
  if (!lineups) {
    return (
      <View style={styles.tabPanel}>
        <Text style={styles.noDataText}>Lineups not available</Text>
      </View>
    );
  }

  const pitchWidth = 340;
  const pitchHeight = 500;

  return (
    <View style={[styles.tabPanel, { alignItems: 'center' }]}>
      {/* Team tabs */}
      <View style={styles.lineupTeamRow}>
        <Text style={styles.lineupTeam}>
          {fixture.teams.home.shortName} ({lineups.home.formation})
        </Text>
        <Text style={styles.lineupVs}>vs</Text>
        <Text style={styles.lineupTeam}>
          {fixture.teams.away.shortName} ({lineups.away.formation})
        </Text>
      </View>

      <PitchView width={pitchWidth} height={pitchHeight}>
        <LineupOverlay
          players={lineups.home.players}
          formation={lineups.home.formation}
          pitchWidth={pitchWidth}
          pitchHeight={pitchHeight}
          isAway={false}
          teamColor={OffsideColors.primaryGreen}
        />
        <LineupOverlay
          players={lineups.away.players}
          formation={lineups.away.formation}
          pitchWidth={pitchWidth}
          pitchHeight={pitchHeight}
          isAway={true}
          teamColor={OffsideColors.secondaryBlue}
        />
      </PitchView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backText: {
    ...Typography.body,
    color: OffsideColors.primaryGreen,
  },
  scoreHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  leagueText: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  teamCol: {
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  teamBadgeLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: OffsideColors.card,
    borderWidth: 2,
    borderColor: OffsideColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadgeText: {
    ...Typography.scoreMedium,
    fontSize: 18,
    color: OffsideColors.primaryGreen,
  },
  teamNameScore: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
    fontSize: 13,
  },
  scoreCenterCol: {
    alignItems: 'center',
    gap: 6,
  },
  scoreBig: {
    ...Typography.score,
    fontSize: 40,
  },
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: OffsideColors.liveDim,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: OffsideColors.live,
  },
  liveStatusText: {
    ...Typography.badge,
    color: OffsideColors.live,
    fontSize: 11,
  },
  statusText: {
    ...Typography.badge,
    color: OffsideColors.textTertiary,
    fontSize: 12,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: OffsideColors.primaryGreen,
  },
  tabText: {
    ...Typography.chip,
    color: OffsideColors.textTertiary,
  },
  tabTextActive: {
    color: OffsideColors.primaryGreen,
  },
  tabContent: {
    flex: 1,
  },
  tabPanel: {
    padding: 16,
    gap: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsTeamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTeamName: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
  },
  statsVs: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
  },
  noDataText: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
    textAlign: 'center',
    paddingVertical: 40,
  },
  lineupTeamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  lineupTeam: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
    fontSize: 13,
  },
  lineupVs: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: OffsideColors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiButtonText: {
    ...Typography.bodySemiBold,
    color: OffsideColors.background,
  },
  aiLoading: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: OffsideColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
    marginBottom: 16,
  },
  aiLoadingText: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
  },
});
