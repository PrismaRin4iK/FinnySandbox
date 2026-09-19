import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { FINANCIAL_GOALS } from '../content/goals';
import { TASKS } from '../content/tasks';
import { getStageName } from '../logic/petEngine';
import { Palette, Radii, Spacing } from '../theme/colors';

interface ParentScreenProps {
  onBackToGame: () => void;
}

export const ParentScreen: React.FC<ParentScreenProps> = ({ onBackToGame }) => {
  const {
    state,
    resetDemoProfile,
    deleteProfile,
    addParentBonus,
  } = useGame();
  const { profile, pet, savings, selectedGoalId, completedTaskIds, periodSummaries } = state;

  // Родительский барьер: пример 7 * 8 = 56
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const currentGoal =
    FINANCIAL_GOALS.find((g) => g.id === selectedGoalId) || FINANCIAL_GOALS[0];

  const handleVerifyGate = () => {
    if (answerInput.trim() === '56') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Неверный ответ. Попробуйте еще раз: 7 × 8 = ?');
    }
  };

  const handleResetConfirm = () => {
    setConfirmResetVisible(false);
    resetDemoProfile();
    Alert.alert('Успешно', 'Тестовый профиль сброшен к исходному состоянию.');
    onBackToGame();
  };

  const handleDeleteConfirm = () => {
    setConfirmDeleteVisible(false);
    deleteProfile();
    Alert.alert('Успешно', 'Локальный профиль удалён.');
    onBackToGame();
  };

  // Экран родительского барьера
  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gateContainer}>
          <View style={styles.gateCard}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>🛡️</Text>
            <Text style={styles.gateTitle}>Раздел для родителей</Text>
            <Text style={styles.gateSub}>
              Подтвердите, что вы взрослый. Решите простой пример:
            </Text>

            <Text style={styles.mathEquation}>7 × 8 = ?</Text>

            <TextInput
              style={styles.mathInput}
              value={answerInput}
              onChangeText={setAnswerInput}
              keyboardType="number-pad"
              placeholder="Введите ответ"
              placeholderTextColor={Palette.textMuted}
              maxLength={4}
            />

            {errorMsg ? <Text style={styles.gateError}>{errorMsg}</Text> : null}

            <TouchableOpacity
              style={styles.gateSubmitBtn}
              activeOpacity={0.85}
              onPress={() => {
                handleVerifyGate();
              }}>
              <Text style={styles.gateSubmitText}>Войти в раздел</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gateBackBtn}
              activeOpacity={0.7}
              onPress={onBackToGame}>
              <Text style={styles.gateBackText}>Вернуться в игру</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Раздел для взрослого 🛡️</Text>
            <Text style={styles.screenSubtitle}>
              Мониторинг прогресса и управление данными
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backSmallBtn}
            onPress={onBackToGame}>
            <Text style={styles.backSmallText}>В игру ✕</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Образовательные цели и педагогический контекст */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Просветительская цель приложения</Text>
          <Text style={styles.cardText}>
            Приложение «Питомец Финни» формирует у ребенка 7–11 лет понимание трёх ключевых финансовых решений:
            {'\n'}• <Text style={{ fontWeight: '700' }}>Нужно</Text> — приоритет обязательных трат на жизнь и здоровье.
            {'\n'}• <Text style={{ fontWeight: '700' }}>Хочу</Text> — осознанное управление желаниями и импульсивными покупками.
            {'\n'}• <Text style={{ fontWeight: '700' }}>Коплю</Text> — привычка регулярно откладывать на долгосрочные цели.
          </Text>
        </View>

        {/* 2. Сводка прогресса ребенка */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Прогресс ребенка</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{profile.name || 'Игрок'}</Text>
              <Text style={styles.metricLabel}>Профиль</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>
                {getStageName(pet.stage)} ({pet.stage}/3)
              </Text>
              <Text style={styles.metricLabel}>Стадия питомца</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{completedTaskIds.length}/{TASKS.length}</Text>
              <Text style={styles.metricLabel}>Пройдено тем</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{savings} 🪙</Text>
              <Text style={styles.metricLabel}>Сумма накоплений</Text>
            </View>
          </View>

          <View style={styles.goalLine}>
            <Text style={styles.goalLineLabel}>Текущая цель:</Text>
            <Text style={styles.goalLineVal}>
              {currentGoal.title} ({savings} / {currentGoal.targetCost} 🪙)
            </Text>
          </View>
        </View>

        {/* 3. Поощрение (опциональное начисление монет родителем) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎁 Поощрить ребенка монетами</Text>
          <Text style={styles.cardText}>
            Вы можете выдать ребенку внутриигровые монеты за реальные полезные дела дома или в учебе:
          </Text>
          <View style={styles.bonusRow}>
            <TouchableOpacity
              style={styles.bonusBtn}
              onPress={() => {
                addParentBonus(50);
                Alert.alert('Успех!', 'Начислено +50 монет ребенку!');
              }}>
              <Text style={styles.bonusBtnText}>+50 🪙 Поощрить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bonusBtn}
              onPress={() => {
                addParentBonus(100);
                Alert.alert('Успех!', 'Начислено +100 монет ребенку!');
              }}>
              <Text style={styles.bonusBtnText}>+100 🪙 Поощрить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Управление тестовым профилем и сброс */}
        <View style={[styles.card, { borderColor: Palette.errorLight }]}>
          <Text style={[styles.cardTitle, { color: Palette.error }]}>
            ⚙️ Управление локальными данными
          </Text>
          <Text style={styles.cardText}>
            Для экспертной проверки вы можете сбросить тестовый профиль к начальному виду либо полностью удалить профиль.
          </Text>

          <View style={styles.dangerButtonsCol}>
            <TouchableOpacity
              style={styles.resetBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmResetVisible(true)}>
              <Text style={styles.resetBtnText}>Сбросить тестовый профиль 🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmDeleteVisible(true)}>
              <Text style={styles.deleteBtnText}>Удалить профиль полностью 🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Модальное окно подтверждения сброса */}
        <Modal transparent animationType="fade" visible={confirmResetVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🔄</Text>
              <Text style={styles.modalTitle}>Сбросить тестовый профиль?</Text>
              <Text style={styles.modalSub}>
                Баланс будет возвращён к 200 монетам, накопления и задания сброшены, питомец вернётся на 1 стадию.
              </Text>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleResetConfirm}>
                <Text style={styles.modalConfirmBtnText}>Да, сбросить данные</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setConfirmResetVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Модальное окно подтверждения удаления */}
        <Modal transparent animationType="fade" visible={confirmDeleteVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🗑️</Text>
              <Text style={styles.modalTitle}>Удалить локальный профиль?</Text>
              <Text style={styles.modalSub}>
                Все данные будут стёрты из памяти устройства. Игра начнётся с первого экрана приветствия.
              </Text>

              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: Palette.error }]}
                onPress={handleDeleteConfirm}>
                <Text style={styles.modalConfirmBtnText}>Да, удалить всё</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setConfirmDeleteVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgMain,
  },
  gateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  gateCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  gateSub: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  mathEquation: {
    fontSize: 28,
    fontWeight: '900',
    color: Palette.primary,
    marginBottom: Spacing.md,
  },
  mathInput: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    width: '100%',
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: Palette.textPrimary,
    borderWidth: 1.5,
    borderColor: Palette.border,
    marginBottom: Spacing.sm,
  },
  gateError: {
    color: Palette.error,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  gateSubmitBtn: {
    backgroundColor: Palette.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: Radii.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  gateSubmitText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '800',
  },
  gateBackBtn: {
    paddingVertical: 10,
  },
  gateBackText: {
    color: Palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  backSmallBtn: {
    backgroundColor: Palette.bgCardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.md,
  },
  backSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 19,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 16,
    fontWeight: '900',
    color: Palette.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  goalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  goalLineLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  goalLineVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.savingsDark,
  },
  bonusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  bonusBtn: {
    flex: 1,
    backgroundColor: Palette.goldLight,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.gold,
  },
  bonusBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.goldDark,
  },
  dangerButtonsCol: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  resetBtn: {
    backgroundColor: Palette.bgCardSubtle,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  deleteBtn: {
    backgroundColor: Palette.errorLight,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.error,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  modalConfirmBtn: {
    backgroundColor: Palette.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalConfirmBtnText: {
    color: Palette.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancelBtn: {
    paddingVertical: 8,
  },
  modalCancelBtnText: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
