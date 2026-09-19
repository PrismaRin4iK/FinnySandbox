import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette, Radii, Spacing } from '../theme/colors';

interface DemoControlsBannerProps {
  currentPeriod: number;
  onFinishPeriod: () => void;
  onResetProfile: () => void;
  onOpenParent: () => void;
}

export const DemoControlsBanner: React.FC<DemoControlsBannerProps> = ({
  currentPeriod,
  onFinishPeriod,
  onResetProfile,
  onOpenParent,
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <View style={styles.periodBadge}>
          <Text style={styles.periodText}>Период {currentPeriod}</Text>
        </View>
        <Text style={styles.demoTag}>🎮 ДЕМО-РЕЖИМ</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.nextPeriodBtn}
          activeOpacity={0.8}
          onPress={onFinishPeriod}>
          <Text style={styles.nextPeriodText}>Итоги периода 🏁</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.parentBtn}
          activeOpacity={0.8}
          onPress={onOpenParent}>
          <Text style={styles.parentText}>👨‍👩‍👦 Взрослым</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodBadge: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  periodText: {
    color: Palette.textWhite,
    fontSize: 12,
    fontWeight: '800',
  },
  demoTag: {
    color: Palette.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextPeriodBtn: {
    backgroundColor: Palette.needs,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
  },
  nextPeriodText: {
    color: Palette.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  parentBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
  },
  parentText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
});
