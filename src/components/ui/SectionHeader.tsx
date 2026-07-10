/**
 * SectionHeader — Offside AI
 * Section title with optional "See All" action and neon green accent.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionText, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.accent} />
        <Text style={Typography.sectionTitle}>{title}</Text>
      </View>
      {actionText && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accent: {
    width: 3,
    height: 18,
    backgroundColor: OffsideColors.primaryGreen,
    borderRadius: 2,
  },
  action: {
    ...Typography.bodySmall,
    color: OffsideColors.primaryGreen,
    fontWeight: '600',
  },
});
