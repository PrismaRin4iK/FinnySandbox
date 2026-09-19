import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { BudgetPlan } from '../logic/types';
import { validateBudgetPlan } from '../logic/economy';
import { Palette, Radii, Spacing } from '../theme/colors';

export const BudgetScreen: React.FC = () => {
  const { state, confirmBudgetPlan } = useGame();
  const { balance, currentPlan, isPlanConfirmed, currentActual } = state;

  // Если план уже был подтвержден, берем его или инициализируем разумными долями
  const defaultNeeds = Math.floor(balance * 0.5);
  const defaultWants = Math.floor(balance * 0.25);
  const defaultSavings = balance - defaultNeeds - defaultWants;

  const [needs, setNeeds] = useState<number>(currentPlan ? currentPlan.needs : defaultNeeds);
  const [wants, setWants] = useState<number>(currentPlan ? currentPlan.wants : defaultWants);
  const [savings, setSavings] = useState<number>(currentPlan ? currentPlan.savings : defaultSavings);

  const planDraft: BudgetPlan = { needs, wants, savings };
  const validation = validateBudgetPlan(planDraft, balance);

  const handleAdjust = (category: 'needs' | 'wants' | 'savings', delta: number) => {
    if (category === 'needs') setNeeds((prev) => Math.max(0, prev + delta));
    if (category === 'wants') setWants((prev) => Math.max(0, prev + delta));
    if (category === 'savings') setSavings((prev) => Math.max(0, prev + delta));
  };

  const handleConfirm = () => {
    if (!validation.isValid) {
      Alert.alert('Внимание', validation.errorMessage);
      return;
    }
    const res = confirmBudgetPlan(planDraft);
    if (!res.success && res.error) {
      Alert.alert('Ошибка', res.error);
    } else {
      Alert.alert('Ура!', 'Твой план бюджета успешно подтверждён!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Личный бюджет 📊</Text>
        <Text style={styles.screenSubtitle}>
          Распредели свои монеты перед покупками с умом!
        </Text>

        {/* Доступный баланс */}
        <View style={styles.balanceRow}>
          <CoinBadge amount={balance} label="Доступно на период" size="lg" />
        </View>

        {/* Режим 1: Сравнение План vs Факт, если план уже подтвержден */}
        {isPlanConfirmed && currentPlan && (
          <View style={styles.planFactCard}>
            <View style={styles.planFactHeader}>
              <Text style={styles.planFactTitle}>Твой текущий бюджет: План vs Факт</Text>
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedText}>План активен ✔</Text>
              </View>
            </View>

            {/* Нужно */}
            <View style={styles.factRow}>
              <View style={styles.factCat}>
                <Text style={styles.factEmoji}>🍏</Text>
                <Text style={styles.factLabel}>Нужно</Text>
              </View>
              <View style={styles.factNumbers}>
                <Text style={styles.factSub}>План: {currentPlan.needs}</Text>
                <Text style={[styles.factMain, { color: Palette.needsDark }]}>
                  Факт: {currentActual.needs} 🪙
                </Text>
              </View>
            </View>

            {/* Хочу */}
            <View style={styles.factRow}>
              <View style={styles.factCat}>
                <Text style={styles.factEmoji}>🎈</Text>
                <Text style={styles.factLabel}>Хочу</Text>
              </View>
              <View style={styles.factNumbers}>
                <Text style={styles.factSub}>План: {currentPlan.wants}</Text>
                <Text style={[styles.factMain, { color: Palette.wantsDark }]}>
                  Факт: {currentActual.wants} 🪙
                </Text>
              </View>
            </View>

            {/* Коплю */}
            <View style={styles.factRow}>
              <View style={styles.factCat}>
                <Text style={styles.factEmoji}>🏦</Text>
                <Text style={styles.factLabel}>Коплю</Text>
              </View>
              <View style={styles.factNumbers}>
                <Text style={styles.factSub}>План: {currentPlan.savings}</Text>
                <Text style={[styles.factMain, { color: Palette.savingsDark }]}>
                  Факт: {currentActual.savings} 🪙
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Форма распределения бюджета */}
        <Text style={styles.sectionHeading}>
          {isPlanConfirmed ? 'Скорректировать план:' : 'Составь свой план:'}
        </Text>

        {/* 1. Нужно */}
        <View style={[styles.categoryCard, { borderColor: Palette.needs }]}>
          <View style={styles.catTop}>
            <View style={styles.catIconTitle}>
              <Text style={{ fontSize: 24 }}>🍏</Text>
              <View>
                <Text style={[styles.catName, { color: Palette.needsDark }]}>
                  1. Нужно (Обязательное)
                </Text>
                <Text style={styles.catHint}>Корм, здоровье и гигиена питомца</Text>
              </View>
            </View>
            <Text style={[styles.catAmount, { color: Palette.needsDark }]}>{needs} 🪙</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('needs', -50)}>
              <Text style={styles.stepText}>-50</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('needs', -10)}>
              <Text style={styles.stepText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('needs', +10)}>
              <Text style={styles.stepTextAdd}>+10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('needs', +50)}>
              <Text style={styles.stepTextAdd}>+50</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Хочу */}
        <View style={[styles.categoryCard, { borderColor: Palette.wants }]}>
          <View style={styles.catTop}>
            <View style={styles.catIconTitle}>
              <Text style={{ fontSize: 24 }}>🎈</Text>
              <View>
                <Text style={[styles.catName, { color: Palette.wantsDark }]}>
                  2. Хочу (Желания)
                </Text>
                <Text style={styles.catHint}>Игрушки, колпаки и лакомства</Text>
              </View>
            </View>
            <Text style={[styles.catAmount, { color: Palette.wantsDark }]}>{wants} 🪙</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('wants', -50)}>
              <Text style={styles.stepText}>-50</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('wants', -10)}>
              <Text style={styles.stepText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('wants', +10)}>
              <Text style={styles.stepTextAdd}>+10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('wants', +50)}>
              <Text style={styles.stepTextAdd}>+50</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Коплю */}
        <View style={[styles.categoryCard, { borderColor: Palette.savings }]}>
          <View style={styles.catTop}>
            <View style={styles.catIconTitle}>
              <Text style={{ fontSize: 24 }}>🏦</Text>
              <View>
                <Text style={[styles.catName, { color: Palette.savingsDark }]}>
                  3. Коплю (Накопления)
                </Text>
                <Text style={styles.catHint}>В копилку на финансовую цель</Text>
              </View>
            </View>
            <Text style={[styles.catAmount, { color: Palette.savingsDark }]}>{savings} 🪙</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('savings', -50)}>
              <Text style={styles.stepText}>-50</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleAdjust('savings', -10)}>
              <Text style={styles.stepText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('savings', +10)}>
              <Text style={styles.stepTextAdd}>+10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnAdd]}
              onPress={() => handleAdjust('savings', +50)}>
              <Text style={styles.stepTextAdd}>+50</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Сводка распределения */}
        <View style={styles.summaryBox}>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Всего запланировано:</Text>
            <Text style={styles.sumValue}>{validation.totalPlanned} 🪙</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Остаток свободного баланса:</Text>
            <Text
              style={[
                styles.sumValue,
                { color: validation.remaining >= 0 ? Palette.needsDark : Palette.error },
              ]}>
              {validation.remaining} 🪙
            </Text>
          </View>

          {!validation.isValid && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {validation.errorMessage}</Text>
            </View>
          )}
        </View>

        {/* Кнопка подтверждения */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            !validation.isValid && styles.confirmBtnDisabled,
          ]}
          disabled={!validation.isValid}
          activeOpacity={0.85}
          onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>
            {isPlanConfirmed ? 'Обновить план бюджета 💾' : 'Подтвердить план бюджета 🎯'}
          </Text>
        </TouchableOpacity>
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
  balanceRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planFactCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.tealLight,
  },
  planFactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    paddingBottom: 6,
  },
  planFactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  confirmedBadge: {
    backgroundColor: Palette.needsLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  confirmedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.needsDark,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  factCat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factEmoji: {
    fontSize: 18,
  },
  factLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  factNumbers: {
    alignItems: 'flex-end',
  },
  factSub: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  factMain: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  categoryCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  catIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: '800',
  },
  catHint: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  catAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepBtn: {
    flex: 1,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  stepBtnAdd: {
    backgroundColor: Palette.goldLight,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textSecondary,
  },
  stepTextAdd: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.goldDark,
  },
  summaryBox: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sumLabel: {
    fontSize: 14,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  sumValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  errorBox: {
    marginTop: Spacing.sm,
    backgroundColor: Palette.errorLight,
    padding: Spacing.sm,
    borderRadius: Radii.sm,
  },
  errorText: {
    fontSize: 12,
    color: Palette.error,
    fontWeight: '700',
    lineHeight: 16,
  },
  confirmBtn: {
    backgroundColor: Palette.primary,
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
  confirmBtnDisabled: {
    backgroundColor: Palette.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: Palette.textWhite,
    fontSize: 16,
    fontWeight: '800',
  },
});
