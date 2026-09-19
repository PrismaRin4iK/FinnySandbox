export type PetSpecies = 'fox' | 'cat' | 'dragon';
export type PetColor = 'orange' | 'teal' | 'purple';
export type PetAccessory = 'none' | 'glasses' | 'scarf' | 'cap' | 'bandana';
export type PetStage = 1 | 2 | 3;
export type PetEmotion = 'happy' | 'neutral' | 'sad';

export interface PetState {
  name: string;
  species: PetSpecies;
  color: PetColor;
  accessory: PetAccessory;
  stage: PetStage;
  hunger: number; // 0 - 100 (100 = сыт)
  mood: number;   // 0 - 100 (100 = отличное настроение)
  care: number;   // 0 - 100 (100 = образцовый уход)
  consecutiveGoodPeriods: number;
}

export interface PlayerProfile {
  name: string;
  isCreated: boolean;
  createdAt: number;
}

export type ItemCategory = 'mandatory' | 'optional';

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: ItemCategory;
  categoryName: 'Нужно' | 'Хочу';
  description: string;
  icon: string;
  hungerBonus: number;
  moodBonus: number;
  careBonus: number;
}

export type TaskTopic = 'budget' | 'savings' | 'shopping';

export interface TaskOption {
  text: string;
  isOptimal: boolean;
  rewardCoins: number;
  hungerDelta?: number;
  moodDelta?: number;
  careDelta?: number;
  explanation: string;
}

export interface Task {
  id: string;
  title: string;
  topic: TaskTopic;
  topicTitle: string;
  story: string;
  options: TaskOption[];
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetCost: number;
  icon: string;
  description: string;
}

export interface BudgetPlan {
  needs: number;    // Нужно (обязательные)
  wants: number;    // Хочу (желания)
  savings: number;  // Коплю (накопления)
}

export interface ActualExpenses {
  needs: number;
  wants: number;
  savings: number;
}

export type TransactionType =
  | 'income_start'
  | 'income_task'
  | 'income_periodic'
  | 'parent_bonus'
  | 'expense_needs'
  | 'expense_wants'
  | 'savings_deposit'
  | 'savings_withdraw';

export interface Transaction {
  id: string;
  timestamp: number;
  period: number;
  type: TransactionType;
  amount: number;
  description: string;
  categoryLabel: string;
}

export interface PeriodSummary {
  periodNumber: number;
  startingBalance: number;
  plan: BudgetPlan;
  fact: ActualExpenses;
  endingBalance: number;
  savingsDeposited: number;
  petMoodResult: string;
  feedbackMessage: string;
  stageReached?: PetStage;
  evolutionExplanation?: string;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  badge: string;
  definition: string;
  example: string;
}

export interface GameState {
  profile: PlayerProfile;
  pet: PetState;
  currentPeriod: number;
  balance: number;
  savings: number;
  selectedGoalId: string;
  currentPlan: BudgetPlan | null;
  isPlanConfirmed: boolean;
  currentActual: ActualExpenses;
  completedTaskIds: string[];
  purchasedItemIds: string[];
  transactions: Transaction[];
  periodSummaries: PeriodSummary[];
  demoMode: boolean;
  onboardingCompleted: boolean;
}
