import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette, Radii, Spacing } from '../theme/colors';

interface LackOfFundsModalProps {
  visible: boolean;
  itemName: string;
  itemPrice: number;
  currentBalance: number;
  missingAmount: number;
  advice: string;
  onClose: () => void;
  onGoToTasks: () => void;
}

export const LackOfFundsModal: React.FC<LackOfFundsModalProps> = ({
  visible,
  itemName,
  itemPrice,
  currentBalance,
  missingAmount,
  advice,
  onClose,
  onGoToTasks,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 36 }}>💡</Text>
          </View>

          <Text style={styles.title}>Монет пока не хватает</Text>

          <View style={styles.infoBox}>
            <Text style={styles.itemTitle}>{itemName}</Text>
            <View style={styles.numbersRow}>
              <View style={styles.numCol}>
                <Text style={styles.numLabel}>Цена</Text>
                <Text style={styles.numValue}>{itemPrice} 🪙</Text>
              </View>
              <View style={styles.numCol}>
                <Text style={styles.numLabel}>У тебя</Text>
                <Text style={[styles.numValue, { color: Palette.primary }]}>
                  {currentBalance} 🪙
                </Text>
              </View>
              <View style={styles.numCol}>
                <Text style={styles.numLabel}>Не хватает</Text>
                <Text style={[styles.numValue, { color: Palette.error }]}>
                  {missingAmount} 🪙
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.adviceText}>{advice}</Text>

          <View style={styles.buttonsCol}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onGoToTasks();
              }}>
              <Text style={styles.primaryButtonText}>Заработать монеты в заданиях 🎯</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Посмотреть другие товары</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  infoBox: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.md,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: 8,
  },
  numCol: {
    alignItems: 'center',
  },
  numLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  numValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonsCol: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Palette.primary,
    paddingVertical: 14,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: Palette.bgCardSubtle,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    color: Palette.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
