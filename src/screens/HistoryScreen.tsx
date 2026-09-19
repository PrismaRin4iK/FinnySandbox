import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { Palette, Radii, Spacing } from '../theme/colors';

export const HistoryScreen: React.FC = () => {
  const { state } = useGame();
  const { transactions } = state;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>История операций 📜</Text>
        <Text style={styles.screenSubtitle}>
          Журнал всех поступлений, покупок и сбережений
        </Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🪙</Text>
            <Text style={styles.emptyTitle}>Здесь пока пусто</Text>
            <Text style={styles.emptySub}>
              Твои покупки, награды и накопления будут сохраняться в этом списке!
            </Text>
          </View>
        ) : (
          <View style={styles.txList}>
            {transactions.map((tx) => {
              const isIncome =
                tx.type === 'income_start' ||
                tx.type === 'income_task' ||
                tx.type === 'income_periodic' ||
                tx.type === 'parent_bonus';
              const isSavings = tx.type === 'savings_deposit' || tx.type === 'savings_withdraw';
              const sign = isIncome || tx.type === 'savings_withdraw' ? '+' : '-';

              const txColor = isIncome
                ? Palette.needsDark
                : isSavings
                ? Palette.savingsDark
                : Palette.wantsDark;

              const emoji =
                tx.type === 'income_task'
                  ? '🎯'
                  : tx.type === 'income_periodic'
                  ? '📅'
                  : tx.type === 'parent_bonus'
                  ? '🎁'
                  : tx.type === 'savings_deposit'
                  ? '🏦'
                  : tx.type === 'savings_withdraw'
                  ? '💸'
                  : tx.type === 'expense_needs'
                  ? '🍏'
                  : '🎈';

              return (
                <View key={tx.id} style={styles.txCard}>
                  <View style={styles.emojiBox}>
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                  </View>

                  <View style={styles.txTextCol}>
                    <Text style={styles.txDesc}>{tx.description}</Text>
                    <Text style={styles.txMeta}>
                      Период {tx.period} • {tx.categoryLabel}
                    </Text>
                  </View>

                  <Text style={[styles.txAmount, { color: txColor }]}>
                    {sign}
                    {tx.amount} 🪙
                  </Text>
                </View>
              );
            })}
          </View>
        )}
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
  emptyCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  txList: {
    gap: Spacing.sm,
  },
  txCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.sm,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTextCol: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  txMeta: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
});
