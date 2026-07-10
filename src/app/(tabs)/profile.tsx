/**
 * Profile Screen — Offside AI
 * User profile with settings, favorite team, stats, and about section.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons, type AppIconName } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { LEAGUE_METADATA } from '@/data/mock';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [favoriteTeam, setFavoriteTeam] = useState('Liverpool');
  const [enabledLeagues, setEnabledLeagues] = useState<number[]>([39, 140, 2]);

  const toggleLeague = (id: number) => {
    setEnabledLeagues((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>DY</Text>
          </View>
          <Text style={styles.userName}>Divyanshu</Text>
          <Text style={styles.userTag}>@divyanshu · Football Enthusiast</Text>
        </Animated.View>

        {/* Activity Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>147</Text>
                <Text style={styles.statLabel}>AI Queries</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>38</Text>
                <Text style={styles.statLabel}>Matches Tracked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Comparisons</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Favorite Team */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard style={styles.sectionCard}>
            <SectionTitle icon={AppIcons.football} title="Favorite Team" />
            <View style={styles.teamChips}>
              {['Liverpool', 'Arsenal', 'Man City', 'Chelsea', 'Real Madrid', 'Barcelona'].map((team) => (
                <Pressable
                  key={team}
                  onPress={() => setFavoriteTeam(team)}
                  style={[
                    styles.teamChip,
                    favoriteTeam === team && styles.teamChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.teamChipText,
                      favoriteTeam === team && styles.teamChipTextActive,
                    ]}
                  >
                    {team}
                  </Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Preferred Leagues */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlassCard style={styles.sectionCard}>
            <SectionTitle icon={AppIcons.stadium} title="Preferred Leagues" />
            <View style={styles.leagueList}>
              {Object.entries(LEAGUE_METADATA).map(([idStr, meta]) => {
                const id = parseInt(idStr, 10);
                const isEnabled = enabledLeagues.includes(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => toggleLeague(id)}
                    style={styles.leagueRow}
                  >
                    <AppIcon name={meta.icon} size={20} color={meta.color} style={styles.leagueIcon} />
                    <Text style={styles.leagueName}>{meta.name}</Text>
                    <View style={[styles.toggle, isEnabled && styles.toggleActive]}>
                      <View style={[styles.toggleKnob, isEnabled && styles.toggleKnobActive]} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <GlassCard style={styles.sectionCard}>
            <SectionTitle icon={AppIcons.settings} title="Settings" />
            <View style={styles.settingsList}>
              <SettingRow label="Notifications" value="On" icon={AppIcons.notifications} />
              <SettingRow label="Theme" value="Tactical Dark" icon={AppIcons.theme} />
              <SettingRow label="Language" value="English" icon={AppIcons.language} />
              <SettingRow label="Data Usage" value="Standard" icon={AppIcons.dataUsage} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <GlassCard style={styles.sectionCard}>
            <SectionTitle icon={AppIcons.about} title="About" />
            <View style={styles.aboutList}>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Version</Text>
                <Text style={styles.aboutValue}>1.0.0</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>AI Engine</Text>
                <Text style={styles.aboutValue}>Cohere Command</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Data Source</Text>
                <Text style={styles.aboutValue}>API-Football</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Built with</Text>
                <Text style={styles.aboutValue}>Expo SDK 57</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerBrandRow}>
            <AppIcon name={AppIcons.football} size={18} color={OffsideColors.primaryGreen} />
            <Text style={styles.footerBrand}>Offside AI</Text>
          </View>
          <Text style={styles.footerTagline}>The Smartest Football Companion</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: AppIconName; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <AppIcon name={icon} size={18} color={OffsideColors.primaryGreen} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function SettingRow({ label, value, icon }: { label: string; value: string; icon: AppIconName }) {
  return (
    <Pressable style={styles.settingRow}>
      <AppIcon name={icon} size={18} color={OffsideColors.textSecondary} style={styles.settingIcon} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
      <Text style={styles.settingArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    gap: 8,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: OffsideColors.primaryGreenDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: OffsideColors.primaryGreen,
    marginBottom: 8,
  },
  avatarText: {
    ...Typography.scoreMedium,
    fontSize: 28,
    color: OffsideColors.primaryGreen,
  },
  userName: {
    ...Typography.screenTitle,
    textAlign: 'center',
  },
  userTag: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    ...Typography.stat,
    fontSize: 22,
  },
  statLabel: {
    ...Typography.statLabel,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: OffsideColors.cardBorder,
  },
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.cardTitle,
    color: OffsideColors.textPrimary,
  },
  teamChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: OffsideColors.cardElevated,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  teamChipActive: {
    backgroundColor: OffsideColors.primaryGreenDim,
    borderColor: OffsideColors.primaryGreen,
  },
  teamChipText: {
    ...Typography.chip,
    color: OffsideColors.textSecondary,
  },
  teamChipTextActive: {
    color: OffsideColors.primaryGreen,
  },
  leagueList: {
    gap: 4,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  leagueIcon: {
    width: 28,
  },
  leagueName: {
    ...Typography.body,
    color: OffsideColors.textPrimary,
    flex: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: OffsideColors.textTertiary,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: OffsideColors.primaryGreen,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: OffsideColors.background,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  settingsList: {
    gap: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  settingIcon: {
    width: 24,
  },
  settingLabel: {
    ...Typography.body,
    color: OffsideColors.textPrimary,
    flex: 1,
  },
  settingValue: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
  },
  settingArrow: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
    fontSize: 18,
    marginLeft: 4,
  },
  aboutList: {
    gap: 2,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  aboutLabel: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
  },
  aboutValue: {
    ...Typography.bodySemiBold,
    color: OffsideColors.primaryGreen,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrand: {
    ...Typography.sectionTitle,
    color: OffsideColors.primaryGreen,
  },
  footerTagline: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
  },
});
