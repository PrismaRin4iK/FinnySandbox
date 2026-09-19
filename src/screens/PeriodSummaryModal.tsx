import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PeriodSummary } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

interface PeriodSummaryModalProps {
  visible: boolean;
  summary?: PeriodSummary;
  onClose: () => void;
}

export const PeriodSummaryModal: React.FC<PeriodSummaryModalProps> = ({
  visible,
  summary,
  onClose,
}) => {
  if (!summary) return null;

  const { plan, fact, feedbackMessage, periodNumber, petMoodResult } = summary;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 36 }}>🏁</Text>
          </View>

          <Text style={styles.title}>Период {periodNumber} завершён!</Text>
          <Text style={styles.subtitle}>План → Факт → Последствия</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Таблица План vs Факт */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={styles.thCategory}>Категория</Text>
                <Text style={styles.thVal}>План</Text>
                <Text style={styles.thVal}>Факт</Text>
              </View>

              {/* Нужно */}
              <View style={styles.tableRow}>
                <View style={styles.catNameBox}>
                  <Text style={{ fontSize: 18 }}>🍏</Text>
                  <Text style={styles.catLabel}>Нужно</Text>
                </View>
                <Text style={styles.planCell}>{plan.needs} 🪙</Text>
                <Text style={[styles.factCell, { color: Palette.needsDark }]}>
                  {fact.needs} 🪙
                </Text>
              </View>

              {/* Хочу */}
              <View style={styles.tableRow}>
                <View style={styles.catNameBox}>
                  <Text style={{ fontSize: 18 }}>🎈</Text>
                  <Text style={styles.catLabel}>Хочу</Text>
                </View>
                <Text style={styles.planCell}>{plan.wants} 🪙</Text>
                <Text style={[styles.factCell, { color: Palette.wantsDark }]}>
                  {fact.wants} 🪙
                </Text>
              </View>

              {/* Коплю */}
              <View style={styles.tableRow}>
                <View style={styles.catNameBox}>
                  <Text style={{ fontSize: 18 }}>🏦</Text>
                  <Text style={styles.catLabel}>Коплю</Text>
                </View>
                <Text style={styles.planCell}>{plan.savings} 🪙</Text>
                <Text style={[styles.factCell, { color: Palette.savingsDark }]}>
                  {fact.savings} 🪙
                </Text>
              </View>
            </View>

            {/* Состояние питомца */}
            <View style={styles.petStatusCard}>
              <Text style={styles.statusHeading}>🐾 Состояние Финни:</Text>
              <Text style={styles.statusBody}>{petMoodResult}</Text>
            </View>

            {/* Финансовый итог и обратная связь */}
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackHeading}>💡 Уроки периода:</Text>
              <Text style={styles.feedbackBody}>{feedbackMessage}</Text>
            </View>

            {/* Доход на следующий период */}
            <View style={styles.incomeCard}>
              <Text style={{ fontSize: 24 }}>🪙</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.incomeTitle}>Начислены карманные деньги!</Text>
                <Text style={styles.incomeSubtitle}>
                  +120 монет на новый период {periodNumber + 1}. Распорядись ими с умом!
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.nextPeriodBtn}
            activeOpacity={0.85}
            onPress={onClose}>
            <Text style={styles.nextPeriodBtnText}>
              Перейти к периоду {periodNumber + 1} 🚀
            </Text>
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
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.bgCard,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryDark,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  scroll: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  tableCard: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  thCategory: {
    flex: 2,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  thVal: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  catNameBox: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  planCell: {
    flex: 1,
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'right',
    fontWeight: '600',
  },
  factCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '900',
  },
  petStatusCard: {
    backgroundColor: Palette.primaryLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statusHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primaryDark,
    marginBottom: 4,
  },
  statusBody: {
    fontSize: 14,
    color: Palette.textPrimary,
    fontWeight: '600',
    lineHeight: 19,
  },
  feedbackCard: {
    backgroundColor: Palette.tealLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  feedbackHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.tealDark,
    marginBottom: 4,
  },
  feedbackBody: {
    fontSize: 14,
    color: Palette.textPrimary,
    lineHeight: 19,
    fontWeight: '600',
  },
  incomeCard: {
    backgroundColor: Palette.goldLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.gold,
    marginBottom: Spacing.sm,
  },
  incomeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.goldDark,
  },
  incomeSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  nextPeriodBtn: {
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
  nextPeriodBtnText: {
    color: Palette.textWhite,
    fontSize: 17,
    fontWeight: '800',
  },
});
