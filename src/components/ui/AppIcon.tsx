import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import type { AppIconName } from '@/constants/icons';
import { OffsideColors } from '@/constants/theme';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolViewProps['weight'];
  type?: SymbolViewProps['type'];
}

export function AppIcon({
  name,
  size = 20,
  color = OffsideColors.textSecondary,
  style,
  weight = 'regular',
  type = 'monochrome',
}: AppIconProps) {
  return (
    <View pointerEvents="none" style={[styles.container, { width: size, height: size }, style]}>
      <SymbolView name={name} size={size} tintColor={color} weight={weight} type={type} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
