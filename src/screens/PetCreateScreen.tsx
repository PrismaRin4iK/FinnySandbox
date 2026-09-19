import React, { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinnyAvatar } from '../components/FinnyAvatar';
import { PetAccessory, PetColor, PetSpecies } from '../logic/types';
import { Palette, Radii, Spacing } from '../theme/colors';

interface PetCreateScreenProps {
  onComplete: (species: PetSpecies, color: PetColor, accessory: PetAccessory, name: string) => void;
  initialName?: string;
}

export const PetCreateScreen: React.FC<PetCreateScreenProps> = ({
  onComplete,
  initialName = 'Финни',
}) => {
  const [species, setSpecies] = useState<PetSpecies>('fox');
  const [color, setColor] = useState<PetColor>('orange');
  const [accessory, setAccessory] = useState<PetAccessory>('none');
  const [petName, setPetName] = useState<string>(initialName);

  const speciesOptions: { id: PetSpecies; label: string; icon: string }[] = [
    { id: 'fox', label: 'Лисёнок', icon: '🦊' },
    { id: 'cat', label: 'Котёнок', icon: '🐱' },
    { id: 'dragon', label: 'Дракончик', icon: '🐲' },
  ];

  const colorOptions: { id: PetColor; label: string; bg: string }[] = [
    { id: 'orange', label: 'Огненный', bg: '#FF7A00' },
    { id: 'teal', label: 'Морской', bg: '#00A896' },
    { id: 'purple', label: 'Космический', bg: '#8B5CF6' },
  ];

  const accessoryOptions: { id: PetAccessory; label: string; icon: string }[] = [
    { id: 'none', label: 'Без аксессуара', icon: '✨' },
    { id: 'glasses', label: 'Очки', icon: '👓' },
    { id: 'scarf', label: 'Шарфик', icon: '🧣' },
    { id: 'cap', label: 'Кепка', icon: '🧢' },
    { id: 'bandana', label: 'Бандана', icon: '🚩' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Создай своего питомца 🐾</Text>
        <Text style={styles.screenSubtitle}>
          Выбирай внешность, цвет и стильные аксессуары!
        </Text>

        {/* Живое превью питомца */}
        <View style={styles.previewContainer}>
          <FinnyAvatar
            species={species}
            color={color}
            accessory={accessory}
            stage={1}
            emotion="happy"
            size="hero"
            showStageBadge
          />
          <Text style={styles.previewName}>{petName || 'Твой питомец'}</Text>
        </View>

        {/* Имя питомца */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Кличка питомца:</Text>
          <TextInput
            style={styles.nameInput}
            value={petName}
            onChangeText={setPetName}
            placeholder="Назови своего питомца"
            placeholderTextColor={Palette.textMuted}
            maxLength={18}
          />
        </View>

        {/* 1. Вид питомца */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>1. Выбери вид питомца:</Text>
          <View style={styles.optionsRow}>
            {speciesOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  species === opt.id && styles.optionButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSpecies(opt.id)}>
                <Text style={styles.optionIcon}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    species === opt.id && styles.optionLabelActive,
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Цвет окраса */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>2. Выбери цвет окраса:</Text>
          <View style={styles.optionsRow}>
            {colorOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  color === opt.id && styles.optionButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setColor(opt.id)}>
                <View style={[styles.colorCircle, { backgroundColor: opt.bg }]} />
                <Text
                  style={[
                    styles.optionLabel,
                    color === opt.id && styles.optionLabelActive,
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Аксессуары */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>3. Аксессуар:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalRow}>
              {accessoryOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionButtonSmall,
                    accessory === opt.id && styles.optionButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setAccessory(opt.id)}>
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      accessory === opt.id && styles.optionLabelActive,
                    ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Завершение настройки */}
        <TouchableOpacity
          style={styles.doneButton}
          activeOpacity={0.85}
          onPress={() => {
            Keyboard.dismiss();
            onComplete(species, color, accessory, petName.trim() || 'Финни');
          }}>
          <Text style={styles.doneButtonText}>Готово! В мир приключений 🚀</Text>
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
    paddingBottom: Spacing.hero,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  previewContainer: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.xl,
    paddingTop: Spacing.hero,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Palette.primaryLight,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  previewName: {
    marginTop: Spacing.sm,
    fontSize: 22,
    fontWeight: '900',
    color: Palette.primaryDark,
  },
  sectionCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  nameInput: {
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  horizontalRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  optionButton: {
    flex: 1,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
    justifyContent: 'center',
  },
  optionButtonSmall: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Palette.bgCardSubtle,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
    justifyContent: 'center',
  },
  optionButtonActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primaryLight,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  optionLabelActive: {
    color: Palette.primaryDark,
    fontWeight: '800',
  },
  doneButton: {
    backgroundColor: Palette.primary,
    minHeight: 54,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    color: Palette.textWhite,
    fontSize: 18,
    fontWeight: '800',
  },
});
