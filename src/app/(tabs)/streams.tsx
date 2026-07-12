/**
 * Streams Screen — Offside AI
 * External streaming links
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';

import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';

const STREAM_LINKS = [
  { name: 'Footem', url: 'https://footem.site', icon: AppIcons.video },
  { name: 'Epic Sports', url: 'https://epicsports.tv', icon: AppIcons.video },
  { name: 'Soco Live', url: 'https://socolive.pro', icon: AppIcons.video },
  { name: 'ShootYalla', url: 'https://shootyalla.com', icon: AppIcons.video },
  { name: 'Totalsportek', url: 'https://totalsportek.pro', icon: AppIcons.video },
  { name: 'LiveTV.sx', url: 'https://livetv.sx', icon: AppIcons.video },
  { name: 'VIPBox', url: 'https://vipbox.lc', icon: AppIcons.video },
  { name: 'CricHD', url: 'https://crichd.tv', icon: AppIcons.video },
];

export default function StreamsScreen() {
  const insets = useSafeAreaInsets();

  const openStream = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        toolbarColor: OffsideColors.background,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Streams</Text>
        <Text style={styles.subtitle}>Watch live matches online</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {STREAM_LINKS.map((stream, index) => (
            <Animated.View
              key={stream.name}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={styles.cardWrapper}
            >
              <Pressable onPress={() => openStream(stream.url)}>
                <GlassCard style={styles.card}>
                  <View style={styles.iconContainer}>
                    <AppIcon name={stream.icon} size={28} color={OffsideColors.primaryGreen} />
                  </View>
                  <Text style={styles.cardTitle}>{stream.name}</Text>
                  <View style={styles.actionRow}>
                    <Text style={styles.actionText}>Watch Now</Text>
                    <AppIcon name={AppIcons.compare} size={14} color={OffsideColors.primaryGreen} />
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>
          ))}
        </View>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    ...Typography.h1,
    color: OffsideColors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '47%',
  },
  card: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: OffsideColors.primaryGreenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.h3,
    color: OffsideColors.textPrimary,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  actionText: {
    ...Typography.caption,
    color: OffsideColors.primaryGreen,
    fontWeight: '600',
  },
});
