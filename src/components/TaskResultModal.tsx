import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Palette, Radii, Spacing } from '../theme/colors';

interface TaskResultModalProps {
  visible: boolean;
  rewardCoins?: number;
  explanation?: string;
  isOptimal?: boolean;
  onClose: () => void;
}

export const TaskResultModal: React.FC<TaskResultModalProps> = ({
  visible,
  rewardCoins = 0,
  explanation = '',
  isOptimal = true,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isOptimal ? Palette.needsLight : Palette.goldLight },
            ]}>
            <Text style={{ fontSize: 40 }}>{isOptimal ? '🌟' : '💡'}</Text>
          </View>

          <Text style={styles.title}>
            {isOptimal ? 'Отличный выбор!' : 'Интересный урок!'}
          </Text>

          {/* Награда */}
          <View style={styles.rewardBanner}>
            <Text style={styles.rewardBannerText}>
              Начислено: +{rewardCoins} 🪙 в твой бюджет!
            </Text>
          </View>

          {/* Объяснение последствий */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Чему это учит:</Text>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={onClose}>
            <Text style={styles.continueBtnText}>Продолжить игру 🚀</Text>
          </TouchableOpacity>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  rewardBanner: {
    backgroundColor: Palette.goldLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Palette.gold,
    marginBottom: Spacing.md,
  },
  rewardBannerText: {
    fontSize: 16,
    fontWeight: '900',
    color: Palette.goldDark,
  },
  explanationBox: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  explanationLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: Palette.primary,
    width: '100%',
    minHeight: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: Palette.textWhite,
    fontSize: 16,
    fontWeight: '800',
  },
});
