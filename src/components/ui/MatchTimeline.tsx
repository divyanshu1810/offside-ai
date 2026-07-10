/**
 * MatchTimeline — Offside AI
 * Vertical timeline of match events.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons, type AppIconName } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import type { MatchEvent } from '@/data/mock';

interface MatchTimelineProps {
  events: MatchEvent[];
  homeTeamId: number;
}

const EVENT_ICONS: Record<string, AppIconName> = {
  'Goal': AppIcons.football,
  'Normal Goal': AppIcons.football,
  'Own Goal': AppIcons.football,
  'Penalty': AppIcons.football,
  'Missed Penalty': AppIcons.close,
  'Yellow Card': AppIcons.warning,
  'Red Card': AppIcons.warning,
  'Second Yellow card': AppIcons.warning,
  'subst': AppIcons.substitution,
  'Substitution': AppIcons.substitution,
  'Var': AppIcons.video,
};

const EVENT_COLORS: Record<string, string> = {
  'Goal': OffsideColors.primaryGreen,
  'Normal Goal': OffsideColors.primaryGreen,
  'Own Goal': OffsideColors.warning,
  'Penalty': OffsideColors.primaryGreen,
  'Missed Penalty': OffsideColors.live,
  'Yellow Card': OffsideColors.warning,
  'Red Card': OffsideColors.live,
  'Second Yellow card': OffsideColors.live,
  'subst': OffsideColors.secondaryBlue,
  'Substitution': OffsideColors.secondaryBlue,
  'Var': OffsideColors.secondaryBlue,
};

export function MatchTimeline({ events, homeTeamId }: MatchTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No events yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.map((event, index) => {
        const isHome = event.team.id === homeTeamId;
        const icon = EVENT_ICONS[event.detail] || EVENT_ICONS[event.type] || AppIcons.event;
        const iconColor = EVENT_COLORS[event.detail] || EVENT_COLORS[event.type] || OffsideColors.textSecondary;
        const isGoal = event.type === 'Goal';
        const isHalfTime = index > 0 && events[index - 1] && 
          events[index - 1]!.time.elapsed <= 45 && event.time.elapsed > 45;

        return (
          <React.Fragment key={index}>
            {isHalfTime && (
              <View style={styles.halfTimeMarker}>
                <View style={styles.halfTimeLine} />
                <Text style={styles.halfTimeText}>HT</Text>
                <View style={styles.halfTimeLine} />
              </View>
            )}
            <View style={[styles.eventRow, isHome ? styles.eventRowHome : styles.eventRowAway]}>
              {/* Minute */}
              <View style={styles.minuteContainer}>
                <Text style={[styles.minute, isGoal && styles.minuteGoal]}>
                  {event.time.elapsed}&apos;
                  {event.time.extra ? `+${event.time.extra}` : ''}
                </Text>
              </View>

              {/* Timeline dot */}
              <View style={styles.timelineDotContainer}>
                <View style={[styles.timelineDot, isGoal && styles.timelineDotGoal]} />
                {index < events.length - 1 && <View style={styles.timelineLine} />}
              </View>

              {/* Event details */}
              <View style={[styles.eventDetails, isGoal && styles.eventDetailsGoal]}>
                <View style={styles.eventHeader}>
                  <AppIcon name={icon} size={16} color={iconColor} style={styles.eventIcon} />
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventType, isGoal && styles.eventTypeGoal]}>
                      {event.type === 'subst' ? 'Substitution' : event.detail}
                    </Text>
                    <Text style={styles.eventPlayer}>{event.player.name}</Text>
                    {event.assist.name && (
                      <Text style={styles.eventAssist}>
                        {event.type === 'Goal' ? 'Assist: ' : ''}{event.assist.name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: OffsideColors.textTertiary,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventRowHome: {},
  eventRowAway: {},
  minuteContainer: {
    width: 44,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 10,
  },
  minute: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  minuteGoal: {
    color: OffsideColors.primaryGreen,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 20,
    paddingTop: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: OffsideColors.textTertiary,
    zIndex: 1,
  },
  timelineDotGoal: {
    backgroundColor: OffsideColors.primaryGreen,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: OffsideColors.cardBorder,
    marginTop: 4,
    minHeight: 20,
  },
  eventDetails: {
    flex: 1,
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  eventDetailsGoal: {
    borderColor: OffsideColors.primaryGreenDim,
    backgroundColor: 'rgba(0, 255, 135, 0.05)',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  eventIcon: {
    marginTop: 1,
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventTypeGoal: {
    color: OffsideColors.primaryGreen,
  },
  eventPlayer: {
    ...Typography.bodySemiBold,
    color: OffsideColors.textPrimary,
    fontSize: 13,
    marginTop: 2,
  },
  eventAssist: {
    ...Typography.bodySmall,
    color: OffsideColors.textTertiary,
    fontSize: 11,
    marginTop: 1,
  },
  halfTimeMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
    paddingLeft: 44,
  },
  halfTimeLine: {
    flex: 1,
    height: 1,
    backgroundColor: OffsideColors.cardBorder,
  },
  halfTimeText: {
    ...Typography.badge,
    color: OffsideColors.textTertiary,
    fontSize: 10,
  },
});
