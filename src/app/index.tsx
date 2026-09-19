import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavBar, MainTabType } from '@/components/BottomNavBar';
import { DemoControlsBanner } from '@/components/DemoControlsBanner';
import { LackOfFundsModal } from '@/components/LackOfFundsModal';
import { PetEvolutionModal } from '@/screens/PetEvolutionModal';
import { TaskDialogModal } from '@/components/TaskDialogModal';
import { TaskResultModal } from '@/components/TaskResultModal';
import { useGame } from '@/context/GameContext';
import { BudgetScreen } from '@/screens/BudgetScreen';
import { DictionaryScreen } from '@/screens/DictionaryScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { ParentScreen } from '@/screens/ParentScreen';
import { PeriodSummaryModal } from '@/screens/PeriodSummaryModal';
import { PetCreateScreen } from '@/screens/PetCreateScreen';
import { ProfileCreateScreen } from '@/screens/ProfileCreateScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { SavingsScreen } from '@/screens/SavingsScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { TasksScreen } from '@/screens/TasksScreen';
import { Palette } from '@/theme/colors';

export default function AppMain() {
  const {
    state,
    isLoading,
    activeModal,
    modalData,
    setProfileName,
    updatePetCustomization,
    completeOnboarding,
    executeTaskChoice,
    finishPeriod,
    closeModal,
    resetDemoProfile,
  } = useGame();

  const [currentTab, setCurrentTab] = useState<
    MainTabType | 'progress' | 'history' | 'dictionary' | 'parent'
  >('home');
  const [setupStep, setSetupStep] = useState<'onboarding' | 'profile' | 'pet' | 'done'>('onboarding');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  // Экран загрузки
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.primary} />
        <Text style={styles.loadingText}>Загружаем питомца Финни... 🐾</Text>
      </SafeAreaView>
    );
  }

  // 1-3. Первоначальная настройка: Онбординг -> Профиль -> Питомец
  if (!state.onboardingCompleted) {
    if (setupStep === 'onboarding') {
      return (
        <OnboardingScreen
          onStart={() => setSetupStep('profile')}
        />
      );
    }

    if (setupStep === 'profile' || !state.profile.isCreated) {
      return (
        <ProfileCreateScreen
          onContinue={(playerName) => {
            setProfileName(playerName);
            setSetupStep('pet');
          }}
        />
      );
    }

    return (
      <PetCreateScreen
        initialName={state.pet.name || 'Финни'}
        onComplete={(species, color, accessory, name) => {
          updatePetCustomization(species, color, accessory, name);
          completeOnboarding();
          setSetupStep('done');
        }}
      />
    );
  }

  // 4. Основной игровой цикл
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      {/* Баннер демо-режима и перехода периодов */}
      <DemoControlsBanner
        currentPeriod={state.currentPeriod}
        onFinishPeriod={finishPeriod}
        onResetProfile={resetDemoProfile}
        onOpenParent={() => setCurrentTab('parent')}
      />

      {/* Экран активной вкладки */}
      <View style={styles.screenContainer}>
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenParent={() => setCurrentTab('parent')}
            onReopenOnboarding={() => setShowOnboardingModal(true)}
          />
        )}
        {currentTab === 'budget' && <BudgetScreen />}
        {currentTab === 'shop' && (
          <ShopScreen onGoToTasks={() => setCurrentTab('tasks')} />
        )}
        {currentTab === 'savings' && <SavingsScreen />}
        {currentTab === 'tasks' && <TasksScreen />}
        {currentTab === 'progress' && <ProgressScreen />}
        {currentTab === 'history' && <HistoryScreen />}
        {currentTab === 'dictionary' && (
          <DictionaryScreen onReopenOnboarding={() => setShowOnboardingModal(true)} />
        )}
        {currentTab === 'parent' && (
          <ParentScreen onBackToGame={() => setCurrentTab('home')} />
        )}
      </View>

      {/* Нижняя навигация (скрывается только в разделе взрослого) */}
      {currentTab !== 'parent' && (
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* Модальное окно нехватки средств (Шаг 7 сквозного сценария) */}
      <LackOfFundsModal
        visible={activeModal === 'lack_of_funds'}
        itemName={modalData.lackOfFunds?.itemName || ''}
        itemPrice={modalData.lackOfFunds?.itemPrice || 0}
        currentBalance={modalData.lackOfFunds?.currentBalance || 0}
        missingAmount={modalData.lackOfFunds?.missingAmount || 0}
        advice={modalData.lackOfFunds?.advice || ''}
        onClose={closeModal}
        onGoToTasks={() => {
          closeModal();
          setCurrentTab('tasks');
        }}
      />

      {/* Модальное окно диалога финансового задания (Шаг 6 сквозного сценария) */}
      <TaskDialogModal
        visible={activeModal === 'task_dialog'}
        task={modalData.activeTask}
        onClose={closeModal}
        onSelectOption={(idx) => {
          if (modalData.activeTask) {
            executeTaskChoice(modalData.activeTask.id, idx);
          }
        }}
      />

      {/* Модальное окно результата задания с объяснением и начислением валюты */}
      <TaskResultModal
        visible={activeModal === 'task_result'}
        rewardCoins={modalData.taskResult?.rewardCoins}
        explanation={modalData.taskResult?.explanation}
        isOptimal={modalData.taskResult?.isOptimal}
        onClose={closeModal}
      />

      {/* Модальное окно эволюции и роста питомца (Шаг 10 сквозного сценария) */}
      <PetEvolutionModal
        visible={activeModal === 'pet_evolution'}
        stage={modalData.petEvolution?.stage as any}
        explanation={modalData.petEvolution?.explanation}
        onClose={closeModal}
      />

      {/* Модальное окно итогов периода: План vs Факт vs Последствия (Шаг 9-10) */}
      <PeriodSummaryModal
        visible={activeModal === 'period_summary'}
        summary={modalData.periodSummary}
        onClose={closeModal}
      />

      {/* Модальный просмотр онбординга из игры */}
      <Modal
        visible={showOnboardingModal}
        animationType="slide"
        onRequestClose={() => setShowOnboardingModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Palette.bgMain }}>
          <OnboardingScreen onStart={() => setShowOnboardingModal(false)} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgMain,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Palette.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
});
