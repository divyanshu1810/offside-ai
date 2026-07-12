/**
 * InsightCard — Offside AI
 * AI-generated tactical insight with checkmark bullet points.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons, type AppIconName } from '@/constants/icons';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

interface InsightCardProps {
  title: string;
  insights: string[];
  icon?: AppIconName;
}

const ParsedText = ({ text, style }: { text: string; style?: any }) => {
  // Strip leading bullet chars (like ✓, -, *) and spaces
  const cleanText = text.replace(/^(\d+\.|[-*✓])\s+/, '').trim();
  const parts = cleanText.split(/(\*\*.*?\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={{ fontWeight: 'bold', color: OffsideColors.textPrimary }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

export function InsightCard({ title, insights, icon = AppIcons.ai }: InsightCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <AppIcon name={icon} size={18} color={OffsideColors.primaryGreen} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.insights}>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightRow}>
            <Text style={styles.checkmark}>✓</Text>
            <ParsedText text={insight} style={styles.insightText} />
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    ...Typography.cardTitle,
    color: OffsideColors.primaryGreen,
  },
  insights: {
    gap: 8,
  },
  insightRow: {
    flexDirection: 'row',
    gap: 8,
  },
  checkmark: {
    ...Typography.body,
    color: OffsideColors.primaryGreen,
    fontSize: 14,
    marginTop: 1,
  },
  insightText: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
