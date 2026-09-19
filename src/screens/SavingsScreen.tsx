import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { FINANCIAL_GOALS } from '../content/goals';
import { estimateGoalPeriods } from '../logic/economy';
import { Palette, Radii, Spacing } from '../theme/colors';

export const SavingsScreen: React.FC = () => {
  const { state, depositSavings, withdrawSavings, selectGoal } = useGame();
  const { balance, savings, selectedGoalId } = state;

  const currentGoal =
    FINANCIAL_GOALS.find((g) => g.id === selectedGoalId) || FINANCIAL_GOALS[0];
  const progressPercent = Math.min(100, Math.round((savings / currentGoal.targetCost) * 100));
  const remainingCost = Math.max(0, currentGoal.targetCost - savings);

  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);

  const timelineInfo = estimateGoalPeriods(savings, currentGoal.targetCost, 50);

  const handleDeposit = (amount: number) => {
    const res = depositSavings(amount);
    if (!res.success && res.error) {
      Alert.alert('Внимание', res.error);
    } else {
      Alert.alert('Копилка пополнена! 🏦', `Ты успешно отложил ${amount} монет на мечту!`);
    }
  };

  const handleWithdrawConfirm = () => {
    setWithdrawModalVisible(false);
    const res = withdrawSavings(withdrawAmount);
    if (!res.success && res.error) {
      Alert.alert('Внимание', res.error);
    } else {
      Alert.alert('Снято из копилки', `Ты перевёл ${withdrawAmount} монет обратно на баланс.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Копилка и цели 🎯</Text>
        <Text style={styles.screenSubtitle}>
          Откладывай монеты регулярно и приближай свою мечту!
        </Text>

        {/* Сводка: Баланс и Накопления */}
        <View style={styles.financesRow}>
          <CoinBadge amount={balance} label="Доступно" variant="gold" size="md" />
          <CoinBadge amount={savings} label="В копилке" variant="savings" size="md" />
        </View>

        {/* Карточка текущей цели */}
        <View style={styles.activeGoalCard}>
          <View style={styles.goalTopRow}>
            <View style={styles.goalBigIconBox}>
              <Text style={{ fontSize: 44 }}>{currentGoal.icon}</Text>
            </View>
            <View style={styles.goalInfoCol}>
              <Text style={styles.goalTag}>Текущая цель</Text>
              <Text style={styles.goalName}>{currentGoal.title}</Text>
              <Text style={styles.goalPriceTag}>Цель: {currentGoal.targetCost} 🪙</Text>
            </View>
          </View>

          <Text style={styles.goalDescText}>{currentGoal.description}</Text>

          {/* Большой прогресс-бар */}
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTextSmall}>
                Накоплено: {savings} 🪙 ({progressPercent}%)
              </Text>
              <Text style={styles.progressTextRemaining}>
                {remainingCost > 0 ? `Осталось: ${remainingCost} 🪙` : 'Цель достигнута! 🎉'}
              </Text>
            </View>
          </View>

          {/* Расчет срока достижения цели */}
          <View style={styles.timelineBox}>
            <Text style={styles.timelineIcon}>⏱️</Text>
            <Text style={styles.timelineText}>{timelineInfo.description}</Text>
          </View>
        </View>

        {/* Быстрое пополнение накоплений */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Пополнить копилку:</Text>
          <Text style={styles.sectionSubtitle}>Выбери сумму перевода с баланса в сбережения:</Text>
          <View style={styles.depositButtonsRow}>
            {[20, 50, 100].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.depositBtn,
                  balance < amt && styles.depositBtnDisabled,
                ]}
                activeOpacity={0.8}
                onPress={() => handleDeposit(amt)}>
                <Text style={styles.depositBtnText}>+{amt} 🪙</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Снятие из накоплений с подтверждением */}
        <View style={styles.withdrawCard}>
          <View style={styles.withdrawTextCol}>
            <Text style={styles.withdrawTitle}>Срочно нужны монеты?</Text>
            <Text style={styles.withdrawSub}>
              Ты можешь вернуть часть монет из копилки на баланс
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.withdrawActionBtn,
              savings <= 0 && styles.depositBtnDisabled,
            ]}
            disabled={savings <= 0}
            activeOpacity={0.8}
            onPress={() => setWithdrawModalVisible(true)}>
            <Text style={styles.withdrawActionText}>Снять 💸</Text>
          </TouchableOpacity>
        </View>

        {/* Выбор другой цели из 4 вариантов */}
        <Text style={styles.sectionTitle}>Выбрать другую цель:</Text>
        <View style={styles.goalsGrid}>
          {FINANCIAL_GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalSelectCard,
                  isSelected && styles.goalSelectCardActive,
                ]}
                activeOpacity={0.8}
                onPress={() => selectGoal(goal.id)}>
                <Text style={{ fontSize: 32 }}>{goal.icon}</Text>
                <View style={styles.goalSelectCol}>
                  <Text style={styles.goalSelectTitle}>{goal.title}</Text>
                  <Text style={styles.goalSelectCost}>{goal.targetCost} 🪙</Text>
                </View>
                {isSelected ? (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Выбрано ✔</Text>
                  </View>
                ) : (
                  <Text style={styles.selectArrow}>›</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Модальное окно подтверждения снятия средств */}
        <Modal transparent animationType="fade" visible={withdrawModalVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>⚠️</Text>
              <Text style={styles.modalTitle}>Внимание: снятие накоплений</Text>
              <Text style={styles.modalDesc}>
                Если ты снимешь монеты из копилки, накопленная сумма уменьшится, а достижение цели «
                {currentGoal.title}» отдалится!
              </Text>

              <View style={styles.modalSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.modalAmountBtn,
                    withdrawAmount === 30 && styles.modalAmountBtnActive,
                  ]}
                  onPress={() => setWithdrawAmount(30)}>
                  <Text style={styles.modalAmountText}>30 🪙</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalAmountBtn,
                    withdrawAmount === 50 && styles.modalAmountBtnActive,
                  ]}
                  onPress={() => setWithdrawAmount(50)}>
                  <Text style={styles.modalAmountText}>50 🪙</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalAmountBtn,
                    withdrawAmount === 100 && styles.modalAmountBtnActive,
                  ]}
                  onPress={() => setWithdrawAmount(100)}>
                  <Text style={styles.modalAmountText}>100 🪙</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtonsCol}>
                <TouchableOpacity
                  style={styles.modalConfirmWithdrawBtn}
                  activeOpacity={0.85}
                  onPress={handleWithdrawConfirm}>
                  <Text style={styles.modalConfirmWithdrawText}>
                    Да, всё равно снять {withdrawAmount} 🪙
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  activeOpacity={0.8}
                  onPress={() => setWithdrawModalVisible(false)}>
                  <Text style={styles.modalCancelBtnText}>Не снимать, копить дальше! 🛡️</Text>
                </TouchableOpacity>
              </View>
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 90,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  financesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  activeGoalCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Palette.savingsLight,
    shadowColor: Palette.savings,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  goalBigIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.savingsLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfoCol: {
    flex: 1,
  },
  goalTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.savingsDark,
    textTransform: 'uppercase',
  },
  goalName: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginTop: 2,
  },
  goalPriceTag: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.savingsDark,
    marginTop: 2,
  },
  goalDescText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  progressBarWrapper: {
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 14,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.savings,
    borderRadius: Radii.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  progressTextRemaining: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.savingsDark,
  },
  timelineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.savingsLight,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    marginTop: Spacing.xs,
  },
  timelineIcon: {
    fontSize: 18,
  },
  timelineText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.savingsDark,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginBottom: Spacing.md,
  },
  depositButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  depositBtn: {
    flex: 1,
    backgroundColor: Palette.savings,
    minHeight: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.savings,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  depositBtnDisabled: {
    backgroundColor: Palette.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  depositBtnText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '800',
  },
  withdrawCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  withdrawTextCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  withdrawTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  withdrawSub: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  withdrawActionBtn: {
    backgroundColor: Palette.bgCardSubtle,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  withdrawActionText: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  goalsGrid: {
    gap: Spacing.sm,
  },
  goalSelectCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    gap: Spacing.md,
  },
  goalSelectCardActive: {
    borderColor: Palette.savings,
    backgroundColor: Palette.savingsLight,
  },
  goalSelectCol: {
    flex: 1,
  },
  goalSelectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  goalSelectCost: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.savingsDark,
    marginTop: 2,
  },
  selectedBadge: {
    backgroundColor: Palette.savings,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  selectedBadgeText: {
    color: Palette.textWhite,
    fontSize: 11,
    fontWeight: '800',
  },
  selectArrow: {
    fontSize: 22,
    color: Palette.textMuted,
    fontWeight: '800',
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
    maxWidth: 380,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  modalSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  modalAmountBtn: {
    flex: 1,
    backgroundColor: Palette.bgCardSubtle,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalAmountBtnActive: {
    borderColor: Palette.savings,
    backgroundColor: Palette.savingsLight,
  },
  modalAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  modalButtonsCol: {
    width: '100%',
    gap: Spacing.sm,
  },
  modalConfirmWithdrawBtn: {
    backgroundColor: Palette.error,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    minHeight: 46,
    justifyContent: 'center',
  },
  modalConfirmWithdrawText: {
    color: Palette.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancelBtn: {
    backgroundColor: Palette.savings,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    minHeight: 46,
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    color: Palette.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
});
