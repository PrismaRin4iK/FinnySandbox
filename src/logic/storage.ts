import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from './types';

const STORAGE_KEY = '@finny_game_state_v1';

export function getInitialGameState(): GameState {
  return {
    profile: {
      name: '',
      isCreated: false,
      createdAt: Date.now(),
    },
    pet: {
      name: 'Финни',
      species: 'fox',
      color: 'orange',
      accessory: 'none',
      stage: 1,
      hunger: 70,
      mood: 75,
      care: 70,
      consecutiveGoodPeriods: 0,
    },
    currentPeriod: 1,
    balance: 200, // Стартовый баланс игрока (Шаг 4 сквозного сценария)
    savings: 0,
    selectedGoalId: 'goal_house',
    currentPlan: null,
    isPlanConfirmed: false,
    currentActual: {
      needs: 0,
      wants: 0,
      savings: 0,
    },
    completedTaskIds: [],
    purchasedItemIds: [],
    transactions: [
      {
        id: 'tx_init',
        timestamp: Date.now(),
        period: 1,
        type: 'income_start',
        amount: 200,
        description: 'Стартовый бюджет на начало игры',
        categoryLabel: 'Доход',
      },
    ],
    periodSummaries: [],
    demoMode: true,
    onboardingCompleted: false,
  };
}

export async function loadGameState(): Promise<GameState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialGameState();
    }
    const parsed = JSON.parse(raw) as GameState;
    return parsed;
  } catch (err) {
    console.warn('[Storage] Failed to load game state, using defaults:', err);
    return getInitialGameState();
  }
}

export async function saveGameState(state: GameState): Promise<void> {
  try {
    const serialized = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('[Storage] Failed to save game state:', err);
  }
}

export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[Storage] Failed to clear game state:', err);
  }
}
