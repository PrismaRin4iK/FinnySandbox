import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing } from '../theme/colors';

export type MainTabType = 'home' | 'budget' | 'shop' | 'savings' | 'tasks';

interface BottomNavBarProps {
  currentTab: string;
  onSelectTab: (tab: MainTabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);

  const tabs: { id: MainTabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Финни', icon: '🐾' },
    { id: 'budget', label: 'Бюджет', icon: '📊' },
    { id: 'shop', label: 'Магазин', icon: '🛒' },
    { id: 'savings', label: 'Копилка', icon: '🎯' },
    { id: 'tasks', label: 'Задания', icon: '📝' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomInset,
          height: 62 + bottomInset,
        },
      ]}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            onPress={() => onSelectTab(tab.id)}>
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.bgCard,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xs,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 12,
  },
  tabButton: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: Palette.primaryLight,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabIconActive: {
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  tabLabelActive: {
    color: Palette.primaryDark,
    fontWeight: '800',
  },
});
