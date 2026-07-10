/**
 * Tab Layout — Offside AI
 * 5-tab bottom navigation with custom dark theme styling.
 */

import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons, type AppIconName } from '@/constants/icons';
import { OffsideColors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: OffsideColors.primaryGreen,
        tabBarInactiveTintColor: OffsideColors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={AppIcons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={AppIcons.matches} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={AppIcons.stats} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={AppIcons.ai} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={AppIcons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, focused }: { icon: AppIconName; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <AppIcon
        name={icon}
        size={21}
        color={focused ? OffsideColors.primaryGreen : OffsideColors.tabInactive}
        weight={focused ? 'semibold' : 'regular'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: OffsideColors.tabBarBackground,
    borderTopColor: OffsideColors.tabBarBorder,
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 0,
  },
  tabLabel: {
    ...Typography.tabLabel,
    marginTop: 4,
  },
  tabItem: {
    gap: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: OffsideColors.primaryGreenDim,
  },
});
