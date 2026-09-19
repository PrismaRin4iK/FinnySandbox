import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActualExpenses,
  BudgetPlan,
  GameState,
  PeriodSummary,
  PetAccessory,
  PetColor,
  PetSpecies,
  ShopItem,
  Task,
  Transaction,
} from '../logic/types';
import {
  canAfford,
  calculateMissingFunds,
  depositToSavings,
  executePurchase,
  validateBudgetPlan,
  withdrawFromSavings,
} from '../logic/economy';
import { evaluatePeriodEnd } from '../logic/petEngine';
import { clearGameState, getInitialGameState, loadGameState, saveGameState } from '../logic/storage';
import { TASKS } from '../content/tasks';
import { FINANCIAL_GOALS } from '../content/goals';

export interface ModalData {
  lackOfFunds?: {
    itemName: string;
    itemPrice: number;
    currentBalance: number;
    missingAmount: number;
    advice: string;
  };
  periodSummary?: PeriodSummary;
  petEvolution?: {
    stage: number;
    explanation: string;
  };
  activeTask?: Task;
  taskResult?: {
    rewardCoins: number;
    explanation: string;
    isOptimal: boolean;
  };
}

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  activeModal: 'none' | 'lack_of_funds' | 'period_summary' | 'pet_evolution' | 'task_dialog' | 'task_result';
  modalData: ModalData;
  setProfileName: (name: string) => void;
  updatePetCustomization: (
    species: PetSpecies,
    color: PetColor,
    accessory: PetAccessory,
    name?: string
  ) => void;
  completeOnboarding: () => void;
  confirmBudgetPlan: (plan: BudgetPlan) => { success: boolean; error?: string };
  purchaseItem: (item: ShopItem) => { success: boolean; missingInfo?: any };
  depositSavings: (amount: number) => { success: boolean; error?: string };
  withdrawSavings: (amount: number) => { success: boolean; error?: string };
  selectGoal: (goalId: string) => void;
  executeTaskChoice: (taskId: string, optionIndex: number) => void;
  finishPeriod: () => void;
  openTaskModal: (task: Task) => void;
  closeModal: () => void;
  resetDemoProfile: () => void;
  deleteProfile: () => void;
  addParentBonus: (amount: number) => void;
  toggleDemoMode: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(getInitialGameState());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<
    'none' | 'lack_of_funds' | 'period_summary' | 'pet_evolution' | 'task_dialog' | 'task_result'
  >('none');
  const [modalData, setModalData] = useState<ModalData>({});

  // Загрузка состояния при старте
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadGameState();
        setState(loaded);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Персистентность: сохранение при каждом изменении состояния
  useEffect(() => {
    if (!isLoading) {
      saveGameState(state);
    }
  }, [state, isLoading]);

  const setProfileName = (name: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: name.trim() || 'Юный финансист',
        isCreated: true,
      },
    }));
  };

  const updatePetCustomization = (
    species: PetSpecies,
    color: PetColor,
    accessory: PetAccessory,
    name?: string
  ) => {
    setState((prev) => ({
      ...prev,
      pet: {
        ...prev.pet,
        species,
        color,
        accessory,
        name: name && name.trim() ? name.trim() : prev.pet.name,
      },
    }));
  };

  const completeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      onboardingCompleted: true,
    }));
  };

  const confirmBudgetPlan = (plan: BudgetPlan): { success: boolean; error?: string } => {
    const validation = validateBudgetPlan(plan, state.balance);
    if (!validation.isValid) {
      return { success: false, error: validation.errorMessage };
    }

    setState((prev) => ({
      ...prev,
      currentPlan: plan,
      isPlanConfirmed: true,
      currentActual: {
        needs: 0,
        wants: 0,
        savings: 0,
      },
    }));

    return { success: true };
  };

  const purchaseItem = (item: ShopItem): { success: boolean; missingInfo?: any } => {
    if (!canAfford(state.balance, item.price)) {
      const missingInfo = calculateMissingFunds(state.balance, item.price);
      setModalData({
        lackOfFunds: {
          itemName: item.name,
          itemPrice: item.price,
          currentBalance: state.balance,
          missingAmount: missingInfo.missingAmount,
          advice: missingInfo.advice,
        },
      });
      setActiveModal('lack_of_funds');
      return { success: false, missingInfo };
    }

    const res = executePurchase(state, item);
    if (res.success && res.newState) {
      setState(res.newState);
      return { success: true };
    }

    return { success: false };
  };

  const depositSavingsAction = (amount: number): { success: boolean; error?: string } => {
    const res = depositToSavings(state, amount);
    if (!res.success) {
      return { success: false, error: res.errorMessage };
    }
    if (res.newState) {
      setState(res.newState);
    }
    return { success: true };
  };

  const withdrawSavingsAction = (amount: number): { success: boolean; error?: string } => {
    const res = withdrawFromSavings(state, amount);
    if (!res.success) {
      return { success: false, error: res.errorMessage };
    }
    if (res.newState) {
      setState(res.newState);
    }
    return { success: true };
  };

  const selectGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      selectedGoalId: goalId,
    }));
  };

  const openTaskModal = (task: Task) => {
    setModalData({ activeTask: task });
    setActiveModal('task_dialog');
  };

  const executeTaskChoice = (taskId: string, optionIndex: number) => {
    const task = TASKS.find((t) => t.id === taskId);
    if (!task) return;
    const option = task.options[optionIndex];
    if (!option) return;

    const reward = option.rewardCoins;
    const newBalance = state.balance + reward;

    const transaction: Transaction = {
      id: `tx_${Date.now()}_task`,
      timestamp: Date.now(),
      period: state.currentPeriod,
      type: 'income_task',
      amount: reward,
      description: `Награда за задание: ${task.title}`,
      categoryLabel: 'Доход',
    };

    const newPet = {
      ...state.pet,
      hunger: Math.min(100, Math.max(0, state.pet.hunger + (option.hungerDelta || 0))),
      mood: Math.min(100, Math.max(0, state.pet.mood + (option.moodDelta || 0))),
      care: Math.min(100, Math.max(0, state.pet.care + (option.careDelta || 0))),
    };

    setState((prev) => ({
      ...prev,
      balance: newBalance,
      pet: newPet,
      completedTaskIds: prev.completedTaskIds.includes(taskId)
        ? prev.completedTaskIds
        : [...prev.completedTaskIds, taskId],
      transactions: [transaction, ...prev.transactions],
    }));

    setModalData({
      taskResult: {
        rewardCoins: reward,
        explanation: option.explanation,
        isOptimal: option.isOptimal,
      },
    });
    setActiveModal('task_result');
  };

  const finishPeriod = () => {
    const evalResult = evaluatePeriodEnd(state);

    const transaction: Transaction = {
      id: `tx_${Date.now()}_income`,
      timestamp: Date.now(),
      period: evalResult.nextPeriod,
      type: 'income_periodic',
      amount: 120,
      description: `Карманные деньги на период ${evalResult.nextPeriod}`,
      categoryLabel: 'Доход',
    };

    setState((prev) => ({
      ...prev,
      currentPeriod: evalResult.nextPeriod,
      balance: evalResult.newBalance,
      pet: evalResult.newPet,
      isPlanConfirmed: false,
      currentPlan: null,
      currentActual: {
        needs: 0,
        wants: 0,
        savings: 0,
      },
      periodSummaries: [evalResult.summary, ...prev.periodSummaries],
      transactions: [transaction, ...prev.transactions],
    }));

    if (evalResult.evolutionOccurred) {
      setModalData({
        petEvolution: {
          stage: evalResult.newPet.stage,
          explanation: evalResult.evolutionExplanation || '',
        },
        periodSummary: evalResult.summary,
      });
      setActiveModal('pet_evolution');
    } else {
      setModalData({
        periodSummary: evalResult.summary,
      });
      setActiveModal('period_summary');
    }
  };

  const closeModal = () => {
    if (activeModal === 'pet_evolution' && modalData.periodSummary) {
      setActiveModal('period_summary');
    } else {
      setActiveModal('none');
      setModalData({});
    }
  };

  const resetDemoProfile = () => {
    const fresh = getInitialGameState();
    fresh.onboardingCompleted = true;
    fresh.profile = {
      name: 'Финни-Тест',
      isCreated: true,
      createdAt: Date.now(),
    };
    setState(fresh);
    setActiveModal('none');
    setModalData({});
  };

  const deleteProfile = async () => {
    await clearGameState();
    const fresh = getInitialGameState();
    setState(fresh);
    setActiveModal('none');
    setModalData({});
  };

  const addParentBonus = (amount: number) => {
    if (amount <= 0) return;
    const transaction: Transaction = {
      id: `tx_${Date.now()}_parent`,
      timestamp: Date.now(),
      period: state.currentPeriod,
      type: 'parent_bonus',
      amount,
      description: `Поощрение от родителя`,
      categoryLabel: 'Бонус',
    };
    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [transaction, ...prev.transactions],
    }));
  };

  const toggleDemoMode = () => {
    setState((prev) => ({
      ...prev,
      demoMode: !prev.demoMode,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        activeModal,
        modalData,
        setProfileName,
        updatePetCustomization,
        completeOnboarding,
        confirmBudgetPlan,
        purchaseItem,
        depositSavings: depositSavingsAction,
        withdrawSavings: withdrawSavingsAction,
        selectGoal,
        openTaskModal,
        executeTaskChoice,
        finishPeriod,
        closeModal,
        resetDemoProfile,
        deleteProfile,
        addParentBonus,
        toggleDemoMode,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
