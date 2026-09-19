import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DICTIONARY_TERMS } from '../content/dictionary';
import { Palette, Radii, Spacing } from '../theme/colors';

interface DictionaryScreenProps {
  onReopenOnboarding: () => void;
}

export const DictionaryScreen: React.FC<DictionaryScreenProps> = ({
  onReopenOnboarding,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Финансовые слова 📖</Text>
        <Text style={styles.screenSubtitle}>
          Простой словарь важных понятий для юного финансиста
        </Text>

        {/* Кнопка повторного открытия подсказки */}
        <TouchableOpacity
          style={styles.guideBtn}
          activeOpacity={0.8}
          onPress={onReopenOnboarding}>
          <Text style={{ fontSize: 20 }}>💡</Text>
          <Text style={styles.guideBtnText}>Как устроена игра (Обучение)</Text>
        </TouchableOpacity>

        <View style={styles.termsList}>
          {DICTIONARY_TERMS.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.termCard, isExpanded && styles.termCardExpanded]}
                activeOpacity={0.85}
                onPress={() => toggleExpand(item.id)}>
                <View style={styles.termHeader}>
                  <View style={styles.termTitleRow}>
                    <Text style={styles.termBadge}>{item.badge}</Text>
                    <Text style={styles.termTitle}>{item.term}</Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </View>

                <Text style={styles.definitionText}>{item.definition}</Text>

                {isExpanded && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>Пример из жизни:</Text>
                    <Text style={styles.exampleText}>{item.example}</Text>
                  </View>
                )}
              </TouchableOpacity>
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
  guideBtn: {
    backgroundColor: Palette.primaryLight,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  guideBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  termsList: {
    gap: Spacing.sm,
  },
  termCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  termCardExpanded: {
    borderColor: Palette.primary,
    backgroundColor: '#FFFCF9',
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  termBadge: {
    backgroundColor: Palette.bgCardSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.sm,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  definitionText: {
    fontSize: 14,
    color: Palette.textSecondary,
    lineHeight: 20,
  },
  exampleBox: {
    marginTop: Spacing.sm,
    backgroundColor: Palette.bgCardSubtle,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primaryDark,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 13,
    color: Palette.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
