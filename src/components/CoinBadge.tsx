import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radii } from '../theme/colors';

interface CoinBadgeProps {
  amount: number;
  label?: string;
  variant?: 'gold' | 'savings';
  size?: 'sm' | 'md' | 'lg';
}

export const CoinBadge: React.FC<CoinBadgeProps> = ({
  amount,
  label,
  variant = 'gold',
  size = 'md',
}) => {
  const isSavings = variant === 'savings';
  const bgColor = isSavings ? Palette.savingsLight : Palette.goldLight;
  const borderColor = isSavings ? Palette.savings : Palette.gold;
  const textColor = isSavings ? Palette.savingsDark : Palette.goldDark;
  const icon = isSavings ? '🏦' : '🪙';

  const paddingH = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  const paddingV = size === 'sm' ? 4 : size === 'md' ? 6 : 10;
  const fontSize = size === 'sm' ? 13 : size === 'md' ? 16 : 20;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}>
      <Text style={[styles.icon, { fontSize: fontSize + 2 }]}>{icon}</Text>
      <View style={styles.textColumn}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={[styles.amount, { fontSize, color: textColor }]}>
          {amount} {isSavings ? 'в копилке' : 'монет'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.full,
    borderWidth: 1.5,
    gap: 6,
  },
  icon: {
    textAlign: 'center',
  },
  textColumn: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
  },
  amount: {
    fontWeight: '800',
  },
});
