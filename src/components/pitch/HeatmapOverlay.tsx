/**
 * HeatmapOverlay — Offside AI
 * Semi-transparent color gradient spots overlaying the PitchView.
 * Renders heat hotspots based on player position type (ST, RW, LW, CM, CB, etc.).
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { RadialGradient, Circle, Defs, Stop } from 'react-native-svg';
import { OffsideColors } from '@/constants/theme';

interface HeatPoint {
  x: number; // percentage of width (0-100)
  y: number; // percentage of height (0-100)
  r: number; // radius of hotspot
  intensity: 'high' | 'medium' | 'low';
}

interface HeatmapOverlayProps {
  position: string; // ST, RW, LW, CM, CB, etc.
  width: number;
  height: number;
}

// Generate typical heat zones based on player position
const getHeatPointsForPosition = (position: string): HeatPoint[] => {
  switch (position.toUpperCase()) {
    case 'ST':
      return [
        { x: 50, y: 15, r: 45, intensity: 'high' },    // Penalty box center
        { x: 50, y: 25, r: 60, intensity: 'medium' },  // Final third central
        { x: 42, y: 18, r: 35, intensity: 'medium' },  // Left channel inside box
        { x: 58, y: 18, r: 35, intensity: 'medium' },  // Right channel inside box
        { x: 50, y: 35, r: 50, intensity: 'low' },     // Deeper link-up play
      ];
    case 'RW':
      return [
        { x: 80, y: 20, r: 50, intensity: 'high' },    // Right wing final third
        { x: 75, y: 35, r: 60, intensity: 'medium' },  // Right wing middle third
        { x: 65, y: 18, r: 40, intensity: 'medium' },  // Inside right channel
        { x: 50, y: 15, r: 30, intensity: 'low' },     // Runs into the box
      ];
    case 'LW':
      return [
        { x: 20, y: 20, r: 50, intensity: 'high' },    // Left wing final third
        { x: 25, y: 35, r: 60, intensity: 'medium' },  // Left wing middle third
        { x: 35, y: 18, r: 40, intensity: 'medium' },  // Inside left channel
        { x: 50, y: 15, r: 30, intensity: 'low' },     // Runs into the box
      ];
    case 'CM':
    case 'AM':
    case 'DM':
      return [
        { x: 50, y: 50, r: 70, intensity: 'high' },    // Center circle
        { x: 50, y: 35, r: 60, intensity: 'medium' },  // Midfield final third
        { x: 50, y: 65, r: 60, intensity: 'medium' },  // Midfield defensive third
        { x: 35, y: 50, r: 50, intensity: 'low' },     // Left half-space
        { x: 65, y: 50, r: 50, intensity: 'low' },     // Right half-space
      ];
    case 'CB':
      return [
        { x: 50, y: 78, r: 60, intensity: 'high' },    // Center defense area
        { x: 35, y: 75, r: 50, intensity: 'medium' },  // Left center back zone
        { x: 65, y: 75, r: 50, intensity: 'medium' },  // Right center back zone
        { x: 50, y: 62, r: 45, intensity: 'low' },     // Stepping out/midfield block
      ];
    case 'LB':
      return [
        { x: 18, y: 65, r: 55, intensity: 'high' },    // Left back defensive area
        { x: 15, y: 45, r: 60, intensity: 'medium' },  // Left flank middle third
        { x: 15, y: 25, r: 45, intensity: 'low' },     // Left flank attacking third
      ];
    case 'RB':
      return [
        { x: 82, y: 65, r: 55, intensity: 'high' },    // Right back defensive area
        { x: 85, y: 45, r: 60, intensity: 'medium' },  // Right flank middle third
        { x: 85, y: 25, r: 45, intensity: 'low' },     // Right flank attacking third
      ];
    case 'GK':
      return [
        { x: 50, y: 92, r: 35, intensity: 'high' },    // Six yard box
        { x: 50, y: 88, r: 50, intensity: 'medium' },  // Penalty box
      ];
    default:
      return [
        { x: 50, y: 50, r: 80, intensity: 'medium' },
      ];
  }
};

export function HeatmapOverlay({ position, width, height }: HeatmapOverlayProps) {
  const points = getHeatPointsForPosition(position);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          {/* Define radial gradients for heatmap spots */}
          <RadialGradient id="heat-high" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FF4757" stopOpacity={0.65} />
            <Stop offset="40%" stopColor="#FFD93D" stopOpacity={0.45} />
            <Stop offset="70%" stopColor="#00FF87" stopOpacity={0.2} />
            <Stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
          </RadialGradient>
          
          <RadialGradient id="heat-medium" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFD93D" stopOpacity={0.5} />
            <Stop offset="50%" stopColor="#00FF87" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
          </RadialGradient>

          <RadialGradient id="heat-low" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#00FF87" stopOpacity={0.3} />
            <Stop offset="60%" stopColor="#00FF87" stopOpacity={0.1} />
            <Stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {points.map((pt, i) => {
          const cx = (pt.x / 100) * width;
          const cy = (pt.y / 100) * height;
          const fill = `url(#heat-${pt.intensity})`;

          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={pt.r}
              fill={fill}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.85,
  },
});
