import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinBadge } from '../components/CoinBadge';
import { useGame } from '../context/GameContext';
import { TASKS } from '../content/tasks';
import { Task, TaskTopic } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

export const TasksScreen: React.FC = () => {
  const { state, openTaskModal } = useGame();
  const { balance, completedTaskIds } = state;

  const [selectedTopic, setSelectedTopic] = useState<TaskTopic | 'all'>('all');

  const filteredTasks = TASKS.filter((t) => {
    if (selectedTopic === 'all') return true;
    return t.topic === selectedTopic;
  });

  const topicTabs: { id: TaskTopic | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Все', icon: '📋' },
    { id: 'budget', label: 'Бюджет', icon: '📊' },
    { id: 'savings', label: 'Накопления', icon: '🏦' },
    { id: 'shopping', label: 'Покупки', icon: '🛍️' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Финансовые задания 🎯</Text>
        <Text style={styles.screenSubtitle}>
          Помогай Финни принимать верные решения и зарабатывай монеты!
        </Text>

        {/* Баланс игрока */}
        <View style={styles.balanceRow}>
          <CoinBadge amount={balance} label="Твой баланс" size="md" />
        </View>

        {/* Переключатель тем */}
        <View style={styles.topicsRow}>
          {topicTabs.map((tab) => {
            const isActive = selectedTopic === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.topicTab, isActive && styles.topicTabActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedTopic(tab.id)}>
                <Text style={styles.topicTabIcon}>{tab.icon}</Text>
                <Text
                  style={[styles.topicTabText, isActive && styles.topicTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Список заданий */}
        <View style={styles.tasksList}>
          {filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const reward = task.options[0]?.rewardCoins || 100;

            return (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  isCompleted && styles.taskCardCompleted,
                ]}>
                <View style={styles.cardHeader}>
                  <View style={styles.topicBadge}>
                    <Text style={styles.topicBadgeText}>{task.topicTitle}</Text>
                  </View>

                  <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>+{reward} 🪙</Text>
                  </View>
                </View>

                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskStory} numberOfLines={3}>
                  {task.story}
                </Text>

                <View style={styles.cardFooter}>
                  {isCompleted ? (
                    <View style={styles.statusDoneBox}>
                      <Text style={styles.statusDoneText}>Пройдено ✔</Text>
                    </View>
                  ) : (
                    <View style={styles.statusNewBox}>
                      <Text style={styles.statusNewText}>Новое задание ✨</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.openBtn,
                      isCompleted && styles.openBtnReview,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => openTaskModal(task)}>
                    <Text style={styles.openBtnText}>
                      {isCompleted ? 'Пройти снова 🔄' : 'Начать выбор 🚀'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
  balanceRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  topicsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  topicTab: {
    flex: 1,
    backgroundColor: Palette.bgCard,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  topicTabActive: {
    backgroundColor: Palette.primaryLight,
    borderColor: Palette.primary,
  },
  topicTabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  topicTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  topicTabTextActive: {
    color: Palette.primaryDark,
    fontWeight: '800',
  },
  tasksList: {
    gap: Spacing.md,
  },
  taskCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  taskCardCompleted: {
    borderColor: Palette.needsLight,
    backgroundColor: '#F9FCF9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  topicBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  topicBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  rewardBadge: {
    backgroundColor: Palette.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Palette.gold,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '900',
    color: Palette.goldDark,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  taskStory: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: Spacing.sm,
  },
  statusDoneBox: {
    backgroundColor: Palette.needsLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  statusDoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.needsDark,
  },
  statusNewBox: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  statusNewText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryDark,
  },
  openBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  openBtnReview: {
    backgroundColor: Palette.teal,
  },
  openBtnText: {
    color: Palette.textWhite,
    fontSize: 13,
    fontWeight: '800',
  },
});
