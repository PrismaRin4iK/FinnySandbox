import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radii } from '../theme/colors';

interface PetStatBarProps {
  label: string;
  icon: string;
  value: number; // 0 - 100
  color: string;
}

export const PetStatBar: React.FC<PetStatBarProps> = ({
  label,
  icon,
  value,
  color,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{clamped}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 8,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radii.full,
  },
});
