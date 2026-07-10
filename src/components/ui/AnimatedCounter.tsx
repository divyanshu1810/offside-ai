/**
 * AnimatedCounter — Offside AI
 * Numbers animate/count up from 0 to target value on mount.
 */

import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  style?: TextStyle;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  suffix = '',
  prefix = '',
  decimals = 0,
  style,
}: AnimatedCounterProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration]);

  const displayValue = useDerivedValue(() => {
    const val = animatedValue.value;
    if (decimals > 0) {
      return `${prefix}${val.toFixed(decimals)}${suffix}`;
    }
    return `${prefix}${Math.round(val)}${suffix}`;
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: displayValue.value,
    } as { text: string };
  });

  return (
    <AnimatedText
      style={style}
      animatedProps={animatedProps}
    >
      {`${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.round(value)}${suffix}`}
    </AnimatedText>
  );
}
