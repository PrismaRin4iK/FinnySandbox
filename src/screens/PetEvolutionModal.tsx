import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { useGame } from '../context/GameContext';
import { getStageName } from '../logic/petEngine';
import { PetStage } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

interface PetEvolutionModalProps {
  visible: boolean;
  stage?: PetStage;
  explanation?: string;
  onClose: () => void;
}

export const PetEvolutionModal: React.FC<PetEvolutionModalProps> = ({
  visible,
  stage = 2,
  explanation = '',
  onClose,
}) => {
  const { state } = useGame();
  const { pet } = state;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.celebrationEmoji}>🎉 ✨ 🏆</Text>
          <Text style={styles.title}>Твой питомец вырос!</Text>
          <Text style={styles.stageTitle}>
            Новая стадия: {getStageName(stage)} ({stage}/3)
          </Text>

          {/* Большой аватар Финни на новой стадии */}
          <View style={styles.avatarBox}>
            <FinnyAvatar
              species={pet.species}
              color={pet.color}
              accessory={pet.accessory}
              stage={stage}
              emotion="happy"
              size="hero"
              showStageBadge
            />
          </View>

          {/* Причинно-следственное объяснение */}
          <View style={styles.reasonCard}>
            <Text style={styles.reasonHeading}>Почему питомец развился:</Text>
            <Text style={styles.reasonText}>{explanation}</Text>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={onClose}>
            <Text style={styles.continueBtnText}>Ура! Посмотреть итоги 🚀</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primaryDark,
    marginBottom: Spacing.md,
  },
  avatarBox: {
    marginVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonCard: {
    backgroundColor: Palette.goldLight,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
    borderWidth: 1.5,
    borderColor: Palette.gold,
  },
  reasonHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.goldDark,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: Palette.primary,
    width: '100%',
    minHeight: 52,
    borderRadius: Radii.lg,
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
