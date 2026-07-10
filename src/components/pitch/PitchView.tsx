/**
 * PitchView — Offside AI
 * SVG football pitch (120×80 coordinate system).
 * Dark green with lighter stripes, used as base for lineups and heatmaps.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Line, Circle, G } from 'react-native-svg';
import { OffsideColors } from '@/constants/theme';

interface PitchViewProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function PitchView({ width = 340, height = 500, children, style }: PitchViewProps) {
  const padding = 10;
  const pitchW = width - padding * 2;
  const pitchH = height - padding * 2;
  const lineColor = OffsideColors.pitchLine;
  const lineWidth = 1;

  // Penalty area dimensions (proportional)
  const penAreaW = pitchW * 0.6;
  const penAreaH = pitchH * 0.13;
  const goalAreaW = pitchW * 0.3;
  const goalAreaH = pitchH * 0.06;
  const centerR = pitchW * 0.12;
  const penSpotOffset = pitchH * 0.09;
  const arcR = pitchW * 0.1;

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Pitch background */}
        <Rect x={0} y={0} width={width} height={height} fill={OffsideColors.pitchDark} rx={12} />
        
        {/* Alternating stripes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Rect
            key={i}
            x={padding}
            y={padding + (pitchH / 8) * i}
            width={pitchW}
            height={pitchH / 8}
            fill={i % 2 === 0 ? OffsideColors.pitchDark : OffsideColors.pitchLight}
            opacity={0.5}
          />
        ))}

        {/* Pitch outline */}
        <Rect
          x={padding}
          y={padding}
          width={pitchW}
          height={pitchH}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
        />

        {/* Center line */}
        <Line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke={lineColor}
          strokeWidth={lineWidth}
        />

        {/* Center circle */}
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={centerR}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
        />

        {/* Center spot */}
        <Circle cx={width / 2} cy={height / 2} r={2} fill={lineColor} />

        {/* Top penalty area */}
        <G>
          <Rect
            x={(width - penAreaW) / 2}
            y={padding}
            width={penAreaW}
            height={penAreaH}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Rect
            x={(width - goalAreaW) / 2}
            y={padding}
            width={goalAreaW}
            height={goalAreaH}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Circle cx={width / 2} cy={padding + penSpotOffset} r={2} fill={lineColor} />
        </G>

        {/* Bottom penalty area */}
        <G>
          <Rect
            x={(width - penAreaW) / 2}
            y={height - padding - penAreaH}
            width={penAreaW}
            height={penAreaH}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Rect
            x={(width - goalAreaW) / 2}
            y={height - padding - goalAreaH}
            width={goalAreaW}
            height={goalAreaH}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Circle cx={width / 2} cy={height - padding - penSpotOffset} r={2} fill={lineColor} />
        </G>
      </Svg>

      {/* Overlay content (lineups, heatmaps) */}
      {children && (
        <View style={[styles.overlay, { width, height }]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
