/**
 * News Screen — Offside AI
 * Latest football news from BBC Sport with pull-to-refresh.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Image,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { getFootballNews, type NewsArticle } from '@/services/news';

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async () => {
    try {
      const data = await getFootballNews();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  }, [loadNews]);

  const openArticle = (url: string) => {
    Linking.openURL(url);
  };

  const getTimeAgo = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Football News</Text>
        <Text style={styles.subtitle}>Latest headlines from BBC Sport</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={OffsideColors.primaryGreen}
          />
        }
      >
        {loading && articles.length === 0 && (
          <View style={styles.loadingState}>
            <AppIcon name={AppIcons.news} size={48} color={OffsideColors.textTertiary} />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        )}

        {!loading && articles.length === 0 && (
          <View style={styles.emptyState}>
            <AppIcon name={AppIcons.news} size={48} color={OffsideColors.textTertiary} />
            <Text style={styles.emptyTitle}>No news available</Text>
            <Text style={styles.emptyText}>Pull down to refresh</Text>
          </View>
        )}

        {/* Featured Article (first one) */}
        {articles.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Pressable onPress={() => openArticle(articles[0]!.link)}>
              <GlassCard style={styles.featuredCard}>
                {articles[0]!.image && (
                  <Image
                    source={{ uri: articles[0]!.image }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.featuredContent}>
                  <View style={styles.sourceRow}>
                    <View style={styles.sourceBadge}>
                      <Text style={styles.sourceText}>{articles[0]!.source}</Text>
                    </View>
                    <Text style={styles.timeText}>{getTimeAgo(articles[0]!.pubDate)}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{articles[0]!.title}</Text>
                  {articles[0]!.description ? (
                    <Text style={styles.featuredDescription} numberOfLines={2}>
                      {articles[0]!.description}
                    </Text>
                  ) : null}
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>
        )}

        {/* Remaining Articles */}
        {articles.slice(1).map((article, index) => (
          <Animated.View
            key={`${article.link}-${index}`}
            entering={FadeInDown.delay(200 + index * 60).duration(400)}
          >
            <Pressable onPress={() => openArticle(article.link)}>
              <GlassCard style={styles.articleCard}>
                <View style={styles.articleRow}>
                  <View style={styles.articleContent}>
                    <View style={styles.sourceRow}>
                      <View style={styles.sourceBadge}>
                        <Text style={styles.sourceText}>{article.source}</Text>
                      </View>
                      <Text style={styles.timeText}>{getTimeAgo(article.pubDate)}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={3}>
                      {article.title}
                    </Text>
                    {article.description ? (
                      <Text style={styles.articleDescription} numberOfLines={2}>
                        {article.description}
                      </Text>
                    ) : null}
                  </View>
                  {article.image && (
                    <Image
                      source={{ uri: article.image }}
                      style={styles.articleThumb}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>
        ))}

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
  subtitle: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  loadingText: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
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

  // Featured article
  featuredCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 0,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    ...Typography.cardTitle,
    fontSize: 18,
    lineHeight: 24,
    color: OffsideColors.textPrimary,
    marginTop: 8,
  },
  featuredDescription: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },

  // Regular articles
  articleCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
  },
  articleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    ...Typography.cardTitle,
    fontSize: 15,
    lineHeight: 20,
    color: OffsideColors.textPrimary,
    marginTop: 6,
  },
  articleDescription: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    marginTop: 4,
    lineHeight: 18,
  },
  articleThumb: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
  },

  // Source badge
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceBadge: {
    backgroundColor: OffsideColors.primaryGreenDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  sourceText: {
    ...Typography.chip,
    color: OffsideColors.primaryGreen,
    fontSize: 10,
  },
  timeText: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    fontSize: 11,
  },
});
