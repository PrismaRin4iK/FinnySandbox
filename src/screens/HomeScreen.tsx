import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinBadge } from '../components/CoinBadge';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { PetStatBar } from '../components/PetStatBar';
import { useGame } from '../context/GameContext';
import { FINANCIAL_GOALS } from '../content/goals';
import { TASKS } from '../content/tasks';
import { getPetEmotion, getPetStatusText, getStageName } from '../logic/petEngine';
import { Palette, Radii, Spacing } from '../theme/colors';

interface HomeScreenProps {
  onNavigateTab: (tab: 'budget' | 'shop' | 'savings' | 'tasks' | 'progress' | 'history' | 'dictionary') => void;
  onOpenParent: () => void;
  onReopenOnboarding: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenParent,
  onReopenOnboarding,
}) => {
  const { state, openTaskModal } = useGame();
  const { pet, balance, savings, selectedGoalId, completedTaskIds } = state;

  const currentGoal =
    FINANCIAL_GOALS.find((g) => g.id === selectedGoalId) || FINANCIAL_GOALS[0];
  const goalProgress = Math.min(100, Math.round((savings / currentGoal.targetCost) * 100));

  // Находим первое невыполненное задание
  const activeTask = TASKS.find((t) => !completedTaskIds.includes(t.id)) || TASKS[0];
  const isTaskCompleted = completedTaskIds.includes(activeTask.id);

  const petEmotion = getPetEmotion(pet);
  const statusMessage = getPetStatusText(pet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Верхняя строка профиля и кнопок */}
        <View style={styles.topHeader}>
          <View style={styles.playerInfo}>
            <Text style={styles.greeting}>Привет,</Text>
            <Text style={styles.playerName}>{state.profile.name || 'Друг'}!</Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('dictionary')}
              accessibilityLabel="Финансовый словарь">
              <Text style={{ fontSize: 18 }}>📖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('history')}
              accessibilityLabel="История операций">
              <Text style={{ fontSize: 18 }}>📜</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={onReopenOnboarding}
              accessibilityLabel="Обучение">
              <Text style={{ fontSize: 18 }}>❓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.parentIconBtn]}
              activeOpacity={0.7}
              onPress={onOpenParent}
              accessibilityLabel="Взрослый раздел">
              <Text style={{ fontSize: 18 }}>🛡️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Финансовая сводка: Баланс и Накопления */}
        <View style={styles.financesRow}>
          <TouchableOpacity
            style={styles.badgeWrapper}
            activeOpacity={0.8}
            onPress={() => onNavigateTab('shop')}>
            <CoinBadge amount={balance} label="Доступно" variant="gold" size="lg" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.badgeWrapper}
            activeOpacity={0.8}
            onPress={() => onNavigateTab('savings')}>
            <CoinBadge amount={savings} label="Накоплено" variant="savings" size="lg" />
          </TouchableOpacity>
        </View>

        {/* Главная зона питомца */}
        <View style={styles.petCard}>
          <View style={styles.stageTag}>
            <Text style={styles.stageTagText}>
              Стадия: {getStageName(pet.stage)} ({pet.stage}/3)
            </Text>
          </View>

          <View style={styles.petContainer}>
            <FinnyAvatar
              species={pet.species}
              color={pet.color}
              accessory={pet.accessory}
              stage={pet.stage}
              emotion={petEmotion}
              size="hero"
            />
          </View>

          <Text style={styles.petNameText}>{pet.name}</Text>

          {/* Реакция и статус питомца */}
          <View
            style={[
              styles.speechBubble,
              petEmotion === 'sad' ? styles.speechBubbleSad : styles.speechBubbleHappy,
            ]}>
            <Text style={styles.speechText}>{statusMessage}</Text>
          </View>

          {/* Показатели состояния */}
          <View style={styles.statsCard}>
            <PetStatBar
              label="Сытость"
              icon="🍗"
              value={pet.hunger}
              color={Palette.needs}
            />
            <PetStatBar
              label="Настроение"
              icon="🎮"
              value={pet.mood}
              color={Palette.primary}
            />
            <PetStatBar
              label="Забота"
              icon="🧼"
              value={pet.care}
              color={Palette.teal}
            />
          </View>
        </View>

        {/* Карточка текущей цели */}
        <TouchableOpacity
          style={styles.goalCard}
          activeOpacity={0.85}
          onPress={() => onNavigateTab('savings')}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIconBox}>
              <Text style={{ fontSize: 28 }}>{currentGoal.icon}</Text>
            </View>
            <View style={styles.goalTextCol}>
              <Text style={styles.goalBadge}>Финансовая цель 🎯</Text>
              <Text style={styles.goalTitle}>{currentGoal.title}</Text>
            </View>
            <Text style={styles.goalCostText}>{currentGoal.targetCost} 🪙</Text>
          </View>

          <View style={styles.goalProgressTrack}>
            <View
              style={[
                styles.goalProgressFill,
                { width: `${goalProgress}%` },
              ]}
            />
          </View>

          <View style={styles.goalFooter}>
            <Text style={styles.goalFooterText}>
              Накоплено: {savings} из {currentGoal.targetCost} ({goalProgress}%)
            </Text>
            <Text style={styles.goalActionText}>Пополнить ›</Text>
          </View>
        </TouchableOpacity>

        {/* Карточка активного задания */}
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTopicBadge}>
              <Text style={styles.taskTopicText}>{activeTask.topicTitle}</Text>
            </View>
            <Text style={styles.taskRewardBadge}>+{activeTask.options[0]?.rewardCoins || 100} 🪙</Text>
          </View>

          <Text style={styles.taskTitle}>{activeTask.title}</Text>
          <Text style={styles.taskStory} numberOfLines={2}>
            {activeTask.story}
          </Text>

          <TouchableOpacity
            style={[
              styles.taskCtaBtn,
              isTaskCompleted && styles.taskCtaCompleted,
            ]}
            activeOpacity={0.8}
            onPress={() => openTaskModal(activeTask)}>
            <Text style={styles.taskCtaText}>
              {isTaskCompleted ? 'Задание выполнено ✔ (Открыть ещё)' : 'Выполнить задание 🎯'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Быстрый доступ к Бюджету и Магазину */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: Palette.primaryLight }]}
            activeOpacity={0.8}
            onPress={() => onNavigateTab('budget')}>
            <Text style={{ fontSize: 32, marginBottom: 4 }}>📊</Text>
            <Text style={styles.quickTitle}>Бюджет</Text>
            <Text style={styles.quickSubtitle}>
              {state.isPlanConfirmed ? 'План подтверждён' : 'Составить план'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: Palette.tealLight }]}
            activeOpacity={0.8}
            onPress={() => onNavigateTab('shop')}>
            <Text style={{ fontSize: 32, marginBottom: 4 }}>🛒</Text>
            <Text style={styles.quickTitle}>Магазин</Text>
            <Text style={styles.quickSubtitle}>Корм и игрушки</Text>
          </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  playerInfo: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.textPrimary,
  },
  topActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.bgCard,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentIconBtn: {
    backgroundColor: '#EDE9FE',
    borderColor: '#C4B5FD',
  },
  financesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badgeWrapper: {
    flex: 1,
  },
  petCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stageTag: {
    alignSelf: 'flex-end',
    backgroundColor: Palette.bgCardSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    marginBottom: 4,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  petContainer: {
    marginVertical: Spacing.xs,
  },
  petNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginTop: Spacing.sm,
  },
  speechBubble: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.md,
    width: '100%',
    alignItems: 'center',
  },
  speechBubbleHappy: {
    backgroundColor: Palette.primaryLight,
  },
  speechBubbleSad: {
    backgroundColor: Palette.errorLight,
  },
  speechText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    gap: Spacing.sm,
  },
  goalCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.savingsLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.savingsLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTextCol: {
    flex: 1,
  },
  goalBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.savingsDark,
    textTransform: 'uppercase',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  goalCostText: {
    fontSize: 16,
    fontWeight: '900',
    color: Palette.savingsDark,
  },
  goalProgressTrack: {
    height: 10,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.full,
    overflow: 'hidden',
    marginVertical: 6,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Palette.savings,
    borderRadius: Radii.full,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  goalFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  goalActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.savings,
  },
  taskCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTopicBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.sm,
  },
  taskTopicText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  taskRewardBadge: {
    fontSize: 14,
    fontWeight: '900',
    color: Palette.goldDark,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  taskStory: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  taskCtaBtn: {
    backgroundColor: Palette.primary,
    minHeight: 46,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCtaCompleted: {
    backgroundColor: Palette.needs,
  },
  taskCtaText: {
    color: Palette.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  quickSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
});
