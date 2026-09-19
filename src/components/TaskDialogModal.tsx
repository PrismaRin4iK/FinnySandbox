import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Task } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

interface TaskDialogModalProps {
  visible: boolean;
  task?: Task;
  onSelectOption: (optionIndex: number) => void;
  onClose: () => void;
}

export const TaskDialogModal: React.FC<TaskDialogModalProps> = ({
  visible,
  task,
  onSelectOption,
  onClose,
}) => {
  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{task.topicTitle}</Text>
            </View>
            <TouchableOpacity style={styles.closeIconBtn} onPress={onClose}>
              <Text style={{ fontSize: 20, color: Palette.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.taskTitle}>{task.title}</Text>

            {/* Сюжет с Финни */}
            <View style={styles.storyCard}>
              <Text style={styles.storyIcon}>🦊💭</Text>
              <Text style={styles.storyText}>{task.story}</Text>
            </View>

            <Text style={styles.choicesHeading}>Как поступить? Выбери действие:</Text>

            {/* Варианты выбора */}
            <View style={styles.optionsCol}>
              {task.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionCard}
                  activeOpacity={0.8}
                  onPress={() => onSelectOption(idx)}>
                  <View style={styles.optionIndexCircle}>
                    <Text style={styles.optionIndexText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionText}>{opt.text}</Text>
                    <Text style={styles.optionRewardHint}>
                      Награда: +{opt.rewardCoins} 🪙
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.bgCard,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    marginBottom: Spacing.md,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  storyCard: {
    backgroundColor: Palette.primaryLight,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  storyIcon: {
    fontSize: 24,
  },
  storyText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  choicesHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  optionsCol: {
    gap: Spacing.sm,
  },
  optionCard: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    gap: Spacing.sm,
  },
  optionIndexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    color: Palette.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  optionTextCol: {
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  optionRewardHint: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.goldDark,
  },
});
