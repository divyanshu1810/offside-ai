/**
 * RadarChart — Offside AI
 * SVG radar/spider chart for player attribute comparison.
 * Axes: Pace, Shooting, Passing, Dribbling, Defending, Physical.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, G } from 'react-native-svg';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

const ATTRIBUTES = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
const ATTRIBUTE_LABELS = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical'];

interface RadarChartProps {
  player1Stats: number[]; // [pace, shooting, passing, dribbling, defending, physical]
  player2Stats?: number[]; // Optional second player for comparison
  player1Color?: string;
  player2Color?: string;
  player1Name?: string;
  player2Name?: string;
  size?: number;
}

export function RadarChart({
  player1Stats,
  player2Stats,
  player1Color = OffsideColors.primaryGreen,
  player2Color = OffsideColors.secondaryBlue,
  player1Name,
  player2Name,
  size = 260,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 40;
  const numAxes = ATTRIBUTES.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Get point on circle at given angle and radius
  const getPoint = (angle: number, radius: number): [number, number] => {
    return [
      cx + radius * Math.sin(angle),
      cy - radius * Math.cos(angle),
    ];
  };

  // Generate polygon points from stats
  const getPolygonPoints = (stats: number[]): string => {
    return stats
      .map((val, i) => {
        const radius = (val / 100) * maxRadius;
        const [x, y] = getPoint(i * angleStep, radius);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Grid rings
  const rings = [20, 40, 60, 80, 100];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((ring) => {
          const r = (ring / 100) * maxRadius;
          const points = Array.from({ length: numAxes })
            .map((_, i) => {
              const [x, y] = getPoint(i * angleStep, r);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <Polygon
              key={ring}
              points={points}
              fill="none"
              stroke={OffsideColors.cardBorder}
              strokeWidth={ring === 100 ? 1.5 : 0.5}
              opacity={0.5}
            />
          );
        })}

        {/* Axis lines */}
        {ATTRIBUTES.map((_, i) => {
          const [x, y] = getPoint(i * angleStep, maxRadius);
          return (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={OffsideColors.cardBorder}
              strokeWidth={0.5}
              opacity={0.5}
            />
          );
        })}

        {/* Player 2 polygon (underneath) */}
        {player2Stats && (
          <Polygon
            points={getPolygonPoints(player2Stats)}
            fill={player2Color}
            fillOpacity={0.15}
            stroke={player2Color}
            strokeWidth={2}
          />
        )}

        {/* Player 1 polygon */}
        <Polygon
          points={getPolygonPoints(player1Stats)}
          fill={player1Color}
          fillOpacity={0.2}
          stroke={player1Color}
          strokeWidth={2}
        />

        {/* Data points - Player 1 */}
        {player1Stats.map((val, i) => {
          const radius = (val / 100) * maxRadius;
          const [x, y] = getPoint(i * angleStep, radius);
          return (
            <Circle
              key={`p1-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill={player1Color}
              stroke={OffsideColors.background}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Data points - Player 2 */}
        {player2Stats?.map((val, i) => {
          const radius = (val / 100) * maxRadius;
          const [x, y] = getPoint(i * angleStep, radius);
          return (
            <Circle
              key={`p2-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill={player2Color}
              stroke={OffsideColors.background}
              strokeWidth={1.5}
            />
          );
        })}
      </Svg>

      {/* Axis labels (positioned outside SVG) */}
      {ATTRIBUTES.map((attr, i) => {
        const labelRadius = maxRadius + 24;
        const [x, y] = getPoint(i * angleStep, labelRadius);
        return (
          <View
            key={attr}
            style={[
              styles.axisLabel,
              {
                left: x - 20,
                top: y - 8,
              },
            ]}
          >
            <Text style={styles.axisText}>{attr}</Text>
          </View>
        );
      })}

      {/* Legend */}
      {(player1Name || player2Name) && (
        <View style={styles.legend}>
          {player1Name && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: player1Color }]} />
              <Text style={styles.legendText}>{player1Name}</Text>
            </View>
          )}
          {player2Name && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: player2Color }]} />
              <Text style={styles.legendText}>{player2Name}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  axisLabel: {
    position: 'absolute',
    width: 40,
    alignItems: 'center',
  },
  axisText: {
    ...Typography.badge,
    color: OffsideColors.textSecondary,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
  },
});
