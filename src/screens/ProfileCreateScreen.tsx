import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { Palette, Radii, Spacing } from '../theme/colors';

interface ProfileCreateScreenProps {
  onContinue: (playerName: string) => void;
}

export const ProfileCreateScreen: React.FC<ProfileCreateScreenProps> = ({ onContinue }) => {
  const [name, setName] = useState('Юный финансист');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarBox}>
            <FinnyAvatar species="fox" color="orange" accessory="none" stage={1} size="lg" />
          </View>

          <Text style={styles.title}>Как тебя называть?</Text>
          <Text style={styles.subtitle}>
            Придумай игровое имя или никнейм. Настоящие имя, телефон и e-mail указывать не нужно!
          </Text>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Твоё игровое имя:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Например: Капитан Монетка"
              placeholderTextColor={Palette.textMuted}
              maxLength={20}
              autoCorrect={false}
            />
          </View>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyText}>
              Твой профиль хранится только на этом телефоне и никуда не передаётся.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={() => {
              Keyboard.dismiss();
              onContinue(name.trim() || 'Юный финансист');
            }}>
            <Text style={styles.submitBtnText}>Дальше: создаём питомца! 🐾</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgMain,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  avatarBox: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: Spacing.xl,
  },
  inputCard: {
    width: '100%',
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Palette.border,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.border,
    minHeight: 50,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.tealLight,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  privacyIcon: {
    fontSize: 20,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: Palette.tealDark,
    lineHeight: 18,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Palette.primary,
    width: '100%',
    minHeight: 54,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: Palette.textWhite,
    fontSize: 17,
    fontWeight: '800',
  },
});
