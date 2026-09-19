import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { Palette, Radii, Spacing } from '../theme/colors';

interface OnboardingScreenProps {
  onStart: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Питомец Финни 🐾</Text>
          <Text style={styles.subtitle}>
            Твой пушистый друг и весёлый гид в мире финансов!
          </Text>
        </View>

        {/* Аватар Финни */}
        <View style={styles.avatarSection}>
          <FinnyAvatar species="fox" color="orange" accessory="none" stage={1} size="hero" />
        </View>

        {/* Главная обучающая мысль: 3 типа решений */}
        <Text style={styles.sectionTitle}>3 правила умного финансиста:</Text>

        <View style={styles.cardsCol}>
          {/* Нужно */}
          <View style={[styles.card, { borderColor: Palette.needs }]}>
            <View style={[styles.cardIconBox, { backgroundColor: Palette.needsLight }]}>
              <Text style={styles.cardEmoji}>🍏</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={[styles.cardHeading, { color: Palette.needsDark }]}>
                1. «Нужно» (Обязательное)
              </Text>
              <Text style={styles.cardDescription}>
                Еда, здоровье и уход за Финни. Это самое важное, о чём заботятся в первую очередь!
              </Text>
            </View>
          </View>

          {/* Хочу */}
          <View style={[styles.card, { borderColor: Palette.wants }]}>
            <View style={[styles.cardIconBox, { backgroundColor: Palette.wantsLight }]}>
              <Text style={styles.cardEmoji}>🎈</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={[styles.cardHeading, { color: Palette.wantsDark }]}>
                2. «Хочу» (Желания)
              </Text>
              <Text style={styles.cardDescription}>
                Игрушки, лакомства и украшения. Они радуют, но их можно купить позже, если бюджет ограничен.
              </Text>
            </View>
          </View>

          {/* Коплю */}
          <View style={[styles.card, { borderColor: Palette.savings }]}>
            <View style={[styles.cardIconBox, { backgroundColor: Palette.savingsLight }]}>
              <Text style={styles.cardEmoji}>🏦</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={[styles.cardHeading, { color: Palette.savingsDark }]}>
                3. «Коплю» (Накопления)
              </Text>
              <Text style={styles.cardDescription}>
                Монеты в копилке на большую мечту (самокат или новый домик). Регулярность творит чудеса!
              </Text>
            </View>
          </View>
        </View>

        {/* Кнопка Старт */}
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={onStart}>
          <Text style={styles.startButtonText}>Познакомиться с Финни ✨</Text>
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
    padding: Spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Palette.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  avatarSection: {
    marginVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  cardsCol: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardTextCol: {
    flex: 1,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: Palette.primary,
    width: '100%',
    minHeight: 54,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startButtonText: {
    color: Palette.textWhite,
    fontSize: 18,
    fontWeight: '800',
  },
});
