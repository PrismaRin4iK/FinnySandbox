import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { useGame } from '../context/GameContext';
import { FINANCIAL_GOALS } from '../content/goals';
import { TASKS } from '../content/tasks';
import { getStageName } from '../logic/petEngine';
import { Palette, Radii, Spacing } from '../theme/colors';

export const ProgressScreen: React.FC = () => {
  const { state } = useGame();
  const { pet, savings, selectedGoalId, completedTaskIds, periodSummaries, currentPeriod } =
    state;

  const currentGoal =
    FINANCIAL_GOALS.find((g) => g.id === selectedGoalId) || FINANCIAL_GOALS[0];
  const goalPercent = Math.min(100, Math.round((savings / currentGoal.targetCost) * 100));

  const totalTasks = TASKS.length;
  const completedTasksCount = completedTaskIds.length;
  const taskProgressPercent = Math.round((completedTasksCount / totalTasks) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Учебный прогресс 🏆</Text>
        <Text style={styles.screenSubtitle}>
          Твои финансовые достижения и ступени развития Финни
        </Text>

        {/* 1. Карточка стадии питомца */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>🐾 Развитие питомца</Text>
          <View style={styles.petProgressRow}>
            <FinnyAvatar
              species={pet.species}
              color={pet.color}
              accessory={pet.accessory}
              stage={pet.stage}
              size="md"
            />
            <View style={styles.petProgressInfo}>
              <Text style={styles.petStageTitle}>
                Стадия: {getStageName(pet.stage)} ({pet.stage}/3)
              </Text>
              <Text style={styles.petStageDesc}>
                {pet.stage === 1 && 'Малыш только начинает знакомство с миром финансов.'}
                {pet.stage === 2 && 'Юниор уже умеет составлять бюджет и регулярно копить.'}
                {pet.stage === 3 && 'Мастер уверенно управляет личными ресурсами!'}
              </Text>
              <View style={styles.petStageStepsRow}>
                {[1, 2, 3].map((s) => (
                  <View
                    key={s}
                    style={[
                      styles.stepDot,
                      pet.stage >= s ? styles.stepDotDone : styles.stepDotPending,
                    ]}>
                    <Text style={styles.stepDotText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 2. Прогресс текущей цели */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>🎯 Финансовая цель</Text>
          <View style={styles.goalRow}>
            <Text style={{ fontSize: 36 }}>{currentGoal.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle}>{currentGoal.title}</Text>
              <Text style={styles.goalSaved}>
                Накоплено {savings} из {currentGoal.targetCost} 🪙 ({goalPercent}%)
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${goalPercent}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* 3. Пройденные задания по темам */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.cardHeaderTitle}>📚 Финансовые задания</Text>
            <Text style={styles.tasksPercentText}>
              {completedTasksCount}/{totalTasks} ({taskProgressPercent}%)
            </Text>
          </View>

          <View style={styles.tasksList}>
            {TASKS.map((t) => {
              const isDone = completedTaskIds.includes(t.id);
              return (
                <View key={t.id} style={styles.taskItem}>
                  <Text style={styles.taskCheck}>{isDone ? '✅' : '⚪'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskItemTitle, isDone && styles.taskDoneTitle]}>
                      {t.title}
                    </Text>
                    <Text style={styles.taskItemTopic}>{t.topicTitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 4. История игровых периодов */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>
            🏁 Завершённые периоды ({periodSummaries.length})
          </Text>
          {periodSummaries.length === 0 ? (
            <Text style={styles.emptyText}>
              Ты сейчас в периоде {currentPeriod}. Заверши первый период кнопкой «Итоги периода», чтобы увидеть историю!
            </Text>
          ) : (
            <View style={styles.periodHistoryList}>
              {periodSummaries.map((p) => (
                <View key={p.periodNumber} style={styles.periodHistoryCard}>
                  <View style={styles.periodHistoryHeader}>
                    <Text style={styles.periodNumTitle}>Период {p.periodNumber}</Text>
                    <Text style={styles.periodSavingsText}>
                      +{p.savingsDeposited} 🪙 в копилку
                    </Text>
                  </View>
                  <Text style={styles.periodFeedbackText}>{p.feedbackMessage}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  petProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  petProgressInfo: {
    flex: 1,
  },
  petStageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primaryDark,
    marginBottom: 2,
  },
  petStageDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  petStageStepsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: Palette.primary,
  },
  stepDotPending: {
    backgroundColor: Palette.bgCardSubtle,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.textWhite,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  goalSaved: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginVertical: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.savings,
    borderRadius: Radii.full,
  },
  tasksPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  tasksList: {
    gap: Spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Palette.bgCardSubtle,
    gap: 8,
  },
  taskCheck: {
    fontSize: 16,
  },
  taskItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  taskDoneTitle: {
    color: Palette.textSecondary,
  },
  taskItemTopic: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  emptyText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  periodHistoryList: {
    gap: Spacing.sm,
  },
  periodHistoryCard: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    padding: Spacing.sm,
  },
  periodHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  periodNumTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  periodSavingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.savingsDark,
  },
  periodFeedbackText: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
  },
});
